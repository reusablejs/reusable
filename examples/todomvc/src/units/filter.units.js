import { reusePersistedState } from "./reusePersistedState";

export const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed'
};

export const filterUnit = () => reusePersistedState('FILTER', 'ALL');
