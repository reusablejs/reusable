import { useState } from "react";
import { createStore } from "../../../../src/react-reusable";

export const useCounter = createStore(() => useState(0));
