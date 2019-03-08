import React, { useCallback } from "react";
import { reuse } from "./reuse";
import { set, get, update } from "lodash/fp";

export const useForms = reuse(useState => {
  const [value, setValue] = useState({});

  return {
    value,
    set: (path, val) => setValue(set(path, val))
  };
});

export const useForm = formPath => {
  const forms = useForms();

  const form = get(formPath, forms.value);

  return {
    value: form,
    setValue: value => forms.set(formPath, value),
    clear: () => forms.set(formPath, {})
  };
};

export const Input = ({ value = "", setValue, placeholder = "" }) => {
  const onChange = useCallback(e => setValue(e.target.value), []);
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
};
