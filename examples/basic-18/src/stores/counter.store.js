import {useState} from 'react';
import { createStore } from "reusable";

export const useCounter = createStore(() => useState(0));
