import {useState} from 'react';
import { reusable } from "reusable";

export const useCounter = reusable(() => useState(0));
