import { gql } from "apollo-boost";

export default gql`
  query {
    repository(name: "web-release", owner: "ughitsaaron") {
      releases(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
        nodes {
          id
          resourcePath
          name
          publishedAt
          tagName
          createdAt
          description
          url
          isDraft
          author {
            name
            url
          }
        }
      }
    }
  }
`;
