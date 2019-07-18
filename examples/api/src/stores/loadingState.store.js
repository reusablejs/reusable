import { useState } from "react";
import { createStore } from "reusable";

export const useLoadingState = createStore(() => {
  const [loading, setLoading] = useState(false);
  return {
    loading,
    setLoadingState: setLoading
  };
});
