import { useState, useCallback, useEffect } from "react";
import { NextPage } from "next";
import { get } from "lodash";
import Head from "next/head";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import Tooltip from "@material-ui/core/Tooltip";
// import Replay from "@material-ui/icons/Replay";
// import { format, differenceInWeeks, formatDistanceToNow } from "date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GET_RELEASES from "../queries/releases";
import graphql, { useRestClient, useRequest } from "../lib/client";
// import { Release } from "../queries/types";

type NewReleaseProps = {
  lastTag: [number, number, number];
};

const inc = (n: number) => n + 1;

const NewRelease: NextPage<NewReleaseProps> = ({ lastTag }) => {
  const [lastMajor, lastMinor, lastPatch] = lastTag;
  const [versionBy, setVersionBy] = useState("minor");
  // const [useSimpsons, setUseSimpsons] = useState(true);

  const renderNextTag = () => {
    // there's probably an interesting data structure to use for this…
    switch (versionBy) {
      case "major":
        return [inc(lastMajor), 0, 0].join(".");
      case "minor":
        return [lastMajor, inc(lastMinor), 0].join(".");
      default:
        return [lastMajor, lastMinor, inc(lastPatch)].join(".");
    }
  };

  const {
    pending: isSubmitPending,
    errors: submitErrors,
    response: submitResponse,
    executeRequest: handleSubmit
  } = useRestClient("/repos/ughitsaaron/babas-recipes", {
    method: "POST",
    body: {
      name: `v${renderNextTag()}`,
      tag_name: `v${renderNextTag()}`,
      body: "foo bar, etc.",
      target_commitish: "master",
      draft: true
    }
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Head>
        <title>Web Releases | Draft a release</title>
      </Head>
      <main>
        <Box textAlign="center" p={2}>
          <Typography variant="h2">Draft a release</Typography>
        </Box>
        <Grid container direction="row" justify="center" spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginBottom={2}
                p={2}
              >
                <Typography variant="h5" gutterBottom>
                  Next tag: {renderNextTag()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Last tag: {lastTag.join(".")}
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    name="versionBy"
                    defaultValue="minor"
                    onChange={e => setVersionBy(e.target.value)}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Major"
                      value="major"
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="Minor"
                      value="minor"
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="Patch"
                      value="patch"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Paper>
            <Paper>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginBottom={2}
                p={2}
              >
                <Typography variant="h5" gutterBottom>
                  Draft body
                </Typography>
              </Box>
            </Paper>
            <Box textAlign="center">
              {submitResponse ? (
                <Button
                  variant="text"
                  href={get(submitResponse, "html_url", "/")}
                  target="_blank"
                >
                  Open your draft
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  disabled={isSubmitPending || submitResponse}
                  onClick={handleSubmit}
                >
                  {isSubmitPending ? "Submitting" : "Submit"}
                </Button>
              )}
              {submitErrors && (
                <Typography color="error" variant="caption"></Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </main>
    </Box>
  );
};

NewRelease.getInitialProps = async () => {
  const [latestRelease] = await graphql
    .query({
      query: GET_RELEASES
    })
    .then(({ data }) => data.repository.releases.nodes);

  // tag names a prefixed with a 'v'. so we need to slice off the prefix,
  // split the tag name into its discrete semantic version numbers and convert
  // each to a number type
  const lastTag = latestRelease.tagName
    .slice(1)
    .split(".")
    .map(Number);

  return { lastTag };
};

export default NewRelease;
