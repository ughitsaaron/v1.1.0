import { gql } from "apollo-boost";

export default gql`
  query {
    search(query: "repo:frameio/web-client", type: REPOSITORY, last: 1) {
      nodes {
        ... on Repository {
          refs(
            first: 100
            orderBy: { field: TAG_COMMIT_DATE, direction: ASC }
            refPrefix: "refs/heads/"
          ) {
            nodes {
              name
              target {
                ... on Commit {
                  oid
                  committedDate
                  status {
                    context(name: "ci/circleci: dev_build") {
                      context
                      state
                      targetUrl
                    }
                  }
                  author {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
