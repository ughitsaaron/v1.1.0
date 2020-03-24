import { gql } from "apollo-boost";

export default gql`
  query {
    repository(name: "babas-recipes", owner: "ughitsaaron") {
      releases(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
        nodes {
          id
          resourcePath
          name
          publishedAt
          tagName
          createdAt
          description
          author {
            name
          }
        }
      }
    }
  }
`;
