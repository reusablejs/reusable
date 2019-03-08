import React from "react";
import { Input, useForm } from "./Controlled";

export const Three = () => {
  const firstName = useForm(["user", "firstName"]);
  const lastName = useForm(["user", "lastName"]);

  return (
    <div>
      {firstName.value} - {lastName.value}
      <Input {...firstName} placeholder="First Name" />
      <Input {...lastName} placeholder="Last Name" />
    </div>
  );
};
