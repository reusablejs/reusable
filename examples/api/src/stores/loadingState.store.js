import { useState } from "react";
import { createStore } from "reusable";

export const useLoadingState = createStore(() => {
  const [loading, setLoadingState] = useState(false);
  return {
    loading,
    setLoadingState
  };
});
