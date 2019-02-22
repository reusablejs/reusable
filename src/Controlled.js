import React, { useCallback } from "react";
import { reuseState } from "./reuse";

export const useInputState = (path = "_my_lib_input_path") => {
  const [value, setValue] = reuseState(path);

  return {
    value,
    setValue,
    clear: () => setValue("")
  };
};

export const Input = ({ value = "", setValue, placeholder = "" }) => {
  const onChange = useCallback(e => setValue(e.target.value), []);
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
};
