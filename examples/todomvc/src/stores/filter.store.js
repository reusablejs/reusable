import { createStore } from 'reusable';
import { usePersistedState } from "./usePersistedState";

export const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed'
};

export const useFilter = createStore(() => usePersistedState('FILTER', 'ALL'));
