import {mergeReducer, useReuseState} from 'reuse';

export const useMockState = () => {
  const initialState = {
    contextMenu: {
      visible: false,
      x: 0,
      y: 0
    },

    selectedItems: [],

    groups: [],

    renamedItemId: null,

    sidebarWidth: 340,

    recaptureRequestIds: [],

    clipboard: {
      command: null,
      items: []
    },

    query: '',
    filter: 'All',

    sidebarInFocus: false,
  }

  const [mocks, updateMocks] = useReuseState('mocks', initialState, mergeReducer);
  const openMenu = (x, y) => {
    updateMocks({ visible: true, x, y });
  }
  const toggleFocus = (inFocus) => {
    updateMocks({ sidebarInFocus: inFocus });
  };

  const initGroups = {...}

  useEffect(() => {
    API.on(EVENTS.STORAGE_READY, initGroups);
    API.on(EVENTS.IMPORT, initGroups);
  });

  return {
    mocks,
    openMenu,
    toggleFocus
  };
}