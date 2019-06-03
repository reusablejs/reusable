import { usePersistedState } from "./usePersistedState";
import { reusable } from 'reusable';

export const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed'
};

export const useFilter = reusable(() => usePersistedState('FILTER', 'ALL'));
