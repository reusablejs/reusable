import { useState, useEffect } from 'react';
import {useContainer} from './react-reusable';

export const useReusableLogger = () => {
  const container = useContainer();
  const [stores, setStores] = useState(() => container.getStoresArray())

  useEffect(() => {
    return container.onStoresChanged(() => {
      setStores(container.getStoresArray());
    });
  }, []);

  useEffect(() => {
    const unsubscribes = stores.map((store) => {
      return store.subscribe((value) => {
        console.table(
          stores.map(store => ({
            name: store.name,
            value: JSON.stringify(store.cachedValue)
          }))
        );
      });
    });
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [stores])
};
