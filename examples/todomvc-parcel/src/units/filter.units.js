import { usePersistedState } from "./usePersistedState";
import { createStore } from 'reusable';

export const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed'
};

export const useFilter = createStore(() => usePersistedState('FILTER', 'ALL'));
