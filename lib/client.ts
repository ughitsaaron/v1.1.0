import { useState, useCallback, useEffect } from "react";
import Client from "apollo-boost";
import fetch from "isomorphic-unfetch";

const AUTH_TOKEN = `token ${process.env.AUTH_TOKEN}`;
const GITHUB_ENDPOINTS = {
  GRAPHQL: "https://api.github.com/graphql",
  REST: "https://api.github.com",
};

export default new Client({
  uri: GITHUB_ENDPOINTS.GRAPHQL,
  fetch,
  headers: {
    Authorization: AUTH_TOKEN,
  },
});

export function request(resourceUri: string, { body, ...params }: RequestInit) {
  return fetch(resourceUri, {
    ...params,
    body: JSON.stringify(body),
    headers: { Authorization: AUTH_TOKEN },
  });
}

type UseRequestParams = RequestInit | { body: any };

export function useRequest(uri: string, params: UseRequestParams) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState();
  const [response, setResponse] = useState();
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
export function useRestClient(resource: string, params: UseRequestParams) {
  return useRequest(`${GITHUB_ENDPOINTS.REST}${resource}`, params);
}
