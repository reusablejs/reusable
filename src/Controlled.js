import React, { useCallback } from "react";
import { reuse, reuseState, reuseMemo } from "./reuse";
import { set, get } from "lodash/fp";

export const reuseForms = reuse(() => {
  const [value, setValue] = reuseState({});

  return {
    value,
    set: (path, val) => setValue(set(path, val))
  };
});

export const reuseForm = formPath => {
  const forms = reuseForms();

  const form = get(formPath, forms.value);

  return reuseMemo(() => ({
    value: form,
    setValue: value => forms.set(formPath, value),
    clear: () => forms.set(formPath, {})
  }), [form]);
};

export const Input = ({ value = "", setValue, placeholder = "" }) => {
  const onChange = useCallback(e => setValue(e.target.value), []);
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
};
