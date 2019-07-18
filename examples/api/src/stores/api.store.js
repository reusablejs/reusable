import { createStore } from "reusable/dist/index";
import { useLoadingState } from "./loadingState.store";

export const useApi = createStore(() => {
  const { setLoadingState } = useLoadingState();
  const handleRequest = async (url, method, payload = {}, options = {}) => {
    const config = {
      ...options,
      method: method,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    };
    if (method === "POST") {
      config.body = JSON.stringify(payload);
    }
    try {
      setLoadingState(true);
      const response = await fetch(url, config);
      const serverData = await response.json();
      setLoadingState(false);
      return serverData;
    } catch (e) {
      console.error(e);
    }
  };
  const get = (url, payload, options) => {
    return handleRequest(url, "GET", payload, options);
  };

  const put = (url, payload, options) => {
    return handleRequest(url, "PUT", payload, options);
  };

  const post = (url, payload, options) => {
    return handleRequest(url, "POST", payload, options);
  };
  return {
    get,
    post,
    put
  };
});
