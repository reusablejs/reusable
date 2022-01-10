import { useState } from "react";
import { createStore } from "./src";

const useSomething = createStore(() => {
  const [something, changeSomething] = useState("");

  setTimeout(() => changeSomething((state) => state + "a"), 100000);

  return { something };
});

export default useSomething;
