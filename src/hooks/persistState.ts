import { useState, useEffect, Dispatch, SetStateAction } from "react";

type Response<T> = [T, Dispatch<SetStateAction<T>>];

function usePersistedState<T>(key: string, initialState: T): Response<T> {
  const [state, setState] = useState<T>(() => {
    const storagedValue = localStorage.getItem("key");
    return storagedValue ? JSON.parse(storagedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

export default { usePersistedState };
