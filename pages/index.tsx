import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { filter, map, partialRight } from "lodash";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { format, differenceInWeeks, formatDistanceToNow } from "date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GET_RELEASES from "../queries/releases";
import graphql from "../lib/client";
import { Release } from "../queries/types";

const formatReleaseDate = (timestamp: string) => {
  const releaseDate = new Date(timestamp);

  if (differenceInWeeks(releaseDate, new Date()) <= 1) {
    return formatDistanceToNow(releaseDate, { addSuffix: true });
  }

  return format(releaseDate, "dd MMMM yyyy");
};

type HomeProps = {
  releases: Release[];
};

const Home: NextPage<HomeProps> = ({ releases }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Head>
        <title>Web Releases</title>
      </Head>
      <main>
        <Box textAlign="center" p={2}>
          <Typography variant="h2">Web Releases</Typography>
        </Box>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Link href="/draft">
            <Button color="primary" variant="contained">
              Draft new release
            </Button>
          </Link>
        </Box>
        <Grid container direction="column" justify="center" spacing={3}>
          {map(releases, (release, index) => (
            <Grid item xs={12} key={release.id}>
              <Paper>
                <Box textAlign="center" p={2}>
                  {index === 0 && (
                    <Box marginBottom={1}>
                      <Chip
                        label="Latest release"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  )}
                  <Typography variant="h5">{release.name}</Typography>
                  <Typography variant="body1">
                    Created 
                    {' '}
                    {formatReleaseDate(release.publishedAt)}
                    {' '}
                    by
                    {" "}
                    <a href={release?.author?.url}>{release?.author?.name}</a>
                  </Typography>
                  <Typography>
                    <a href={release.url}>View release notes</a>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </main>
    </Box>
  );
};

const removeDrafts = partialRight(filter, ["isDraft", false]);

Home.getInitialProps = async () => {
  const releases = await graphql
    .query({
      query: GET_RELEASES,
    })
    .then(({ data }) => data.repository.releases.nodes)
    .then(removeDrafts);

  return { releases };
};

export default Home;
