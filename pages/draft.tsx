import { useState, useEffect } from "react";
import { NextPage } from "next";
import { get, add, partialRight, partial, filter } from "lodash";
import Head from "next/head";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import IconButton from "@material-ui/core/IconButton";
// import Tooltip from "@material-ui/core/Tooltip";
// import Replay from "@material-ui/icons/Replay";
// import { format, differenceInWeeks, formatDistanceToNow } from "date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { wordWrap } from "../lib/utils";
import GET_RELEASES from "../queries/releases";
import graphql, { useGithubRestClient, useRequest } from "../lib/client";
// import { Release } from "../queries/types";

const MAX_LINE_LENGTH = 24;
const FRINKIAC_URL =
  "https://x8rrwnhkdh.execute-api.us-east-1.amazonaws.com/api/random";

type NewReleaseProps = {
  lastTag: [number, number, number];
};

const increment = partial(add, 1);

const encode = (str = "") => {
  let base64 = "";
  if (typeof btoa === "function") {
    base64 = btoa(str);
  } else if (typeof Buffer === "function") {
    base64 = Buffer.from(str).toString("base64");
  }

  return base64;
};

const NewRelease: NextPage<NewReleaseProps> = ({ lastTag }) => {
  const [lastMajor, lastMinor, lastPatch] = lastTag;
  const [versionBy, setVersionBy] = useState("minor");
  const [isFrinkiacEnabled, setFrinkiacEnabled] = useState(false);
  const [frinkiacCaption, setFrinkiacCaption] = useState<string>();

  const renderNextTag = () => {
    switch (versionBy) {
      case "major":
        return [increment(lastMajor), 0, 0].join(".");
      case "minor":
        return [lastMajor, increment(lastMinor), 0].join(".");
      default:
        return [lastMajor, lastMinor, increment(lastPatch)].join(".");
    }
  };

  const {
    pending: isSubmitPending,
    errors: submitErrors,
    response: submitResponse,
    executeRequest: handleSubmit,
  } = useGithubRestClient("/repos/ughitsaaron/web-release/releases", {
    method: "POST",
    body: {
      name: `v${renderNextTag()}`,
      tag_name: `v${renderNextTag()}`,
      body: "foo bar, etc.",
      target_commitish: "master",
      draft: true,
    },
  });

  const {
    response: frinkiacResponse,
    executeRequest: frinkiacRequest,
  } = useRequest(FRINKIAC_URL);

  useEffect(() => {
    if (frinkiacResponse) {
      const caption = frinkiacResponse.Subtitles.map((subtitle) =>
        wordWrap(subtitle.Content, MAX_LINE_LENGTH)
      ).join("\n");

      setFrinkiacCaption(caption);
    }
  }, [frinkiacResponse, setFrinkiacCaption]);

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
                <Typography color="textSecondary" gutterBottom>
                  Latest release: {lastTag.join(".")}
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    name="versionBy"
                    defaultValue="minor"
                    onChange={(e) => setVersionBy(e.target.value)}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isFrinkiacEnabled}
                        name="isFrinkiacEnabled"
                        onChange={(e) => {
                          if (!isFrinkiacEnabled && e.target.checked) {
                            frinkiacRequest();
                          }

                          setFrinkiacEnabled(e.target.checked);
                        }}
                      />
                    }
                    label="Use Frinkiac?"
                  />
                  <Button onClick={frinkiacRequest}>Shuffle</Button>
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={(e) => setFrinkiacCaption(e.target.value)}
                    value={frinkiacCaption || ""}
                  />
                </FormControl>
              </Box>
            </Paper>
            <Paper>
              <Box marginBottom={2} p={2}>
                <Typography variant="h5" gutterBottom>
                  v{renderNextTag()} "{frinkiacResponse?.Episode?.Title}"
                </Typography>

                <Image
                  aspectRatio={4 / 3}
                  imageStyle={{ maxWidth: "500px", maxHeight: "500px" }}
                  src={`https://frinkiac.com/meme/${
                    frinkiacResponse?.Frame?.Episode
                  }/${frinkiacResponse?.Frame?.Timestamp}.jpg?b64lines=${encode(
                    frinkiacCaption
                  )}`}
                />

                <Typography variant="body2" gutterBottom>
                  "Draft body"
                </Typography>
              </Box>
            </Paper>
            <Box textAlign="center" marginBottom={2}>
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
              {submitErrors && <Typography color="error" variant="caption" />}
            </Box>
            <Box textAlign="center">
              <Typography paragraph>
                <Link href="/">
                  <a>Return home</a>
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </main>
    </Box>
  );
};

const removeDrafts = partialRight(filter, ["isDraft", false]);

NewRelease.getInitialProps = async () => {
  const [latestRelease] = await graphql
    .query({
      query: GET_RELEASES,
    })
    .then(({ data }) => data.repository.releases.nodes)
    .then(removeDrafts);

  const lastTag = latestRelease.tagName
    .slice(1)
    .split(".")
    .map(Number);

  return { lastTag };
};

export default NewRelease;
