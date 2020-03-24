import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Replay from "@material-ui/icons/Replay";
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
  const [currentRelease, ...restReleases] = releases;

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
        <Grid container direction="row" justify="center" spacing={3}>
          <Grid item xs={10}>
            <Paper>
              <Box textAlign="center" p={2}>
                <Typography variant="h5">{currentRelease.name}</Typography>
                <Typography variant="subtitle2">Current release</Typography>
                <Typography variant="body1">
                  {formatReleaseDate(currentRelease.createdAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          {restReleases.map(release => (
            <Grid item xs={10}>
              <Paper>
                <Box textAlign="center" p={2}>
                  <Grid container justify="center" alignItems="center" xs={12}>
                    <Grid item>
                      <Typography variant="h5">{release.name}</Typography>
                      <Typography variant="body1">
                        {formatReleaseDate(currentRelease.createdAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </main>
    </Box>
  );
};

Home.getInitialProps = async () => {
  const releases = await graphql
    .query({
      query: GET_RELEASES
    })
    .then(({ data }) => data.repository.releases.nodes);

  return { releases };
};

export default Home;
