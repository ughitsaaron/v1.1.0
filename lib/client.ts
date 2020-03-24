import { useState, useCallback } from "react";
import Client from "apollo-boost";
import fetch from "isomorphic-unfetch";

const GITHUB_TOKEN = `token ${process.env.GITHUB_TOKEN}`;
const GITHUB_ENDPOINTS = {
  GRAPHQL: "https://api.github.com/graphql",
  REST: "https://api.github.com",
};

export default new Client({
  uri: GITHUB_ENDPOINTS.GRAPHQL,
  fetch,
  headers: {
    Authorization: GITHUB_TOKEN,
  },
});

export function request(resourceUri: string, { body, ...params }: RequestInit) {
  return fetch(resourceUri, {
    ...params,
    body: JSON.stringify(body),
    headers: { ...params.headers },
  });
}

type UseRequestParams = RequestInit | { body: any };

export function useRequest(uri: string, params: UseRequestParams = {}) {
  const [pending, setPending] = useState<boolean>(false);
  const [errors, setErrors] = useState<object>();
  const [response, setResponse] = useState<any>();
  // eslint-disable-next-line consistent-return
  const executeRequest = useCallback(async () => {
    setPending(true);

    try {
      const results = await request(uri, params).then((res) => res.json());

      setResponse(results);

      return results;
    } catch (e) {
      setErrors(e);
    } finally {
      setPending(false);
    }
  }, [uri, params]);

  return { pending, errors, response, executeRequest };
}

// basically just prefix the resource request with the Github rest endpoint
export function useGithubRestClient(
  resource: string,
  params: UseRequestParams
) {
  return useRequest(`${GITHUB_ENDPOINTS.REST}${resource}`, {
    headers: {
      Authorization: GITHUB_TOKEN,
    },
    ...params,
  });
}
