import React from 'react';
import { createStore } from 'reusable';
import { useState } from 'react';

const useUsers = createStore(() => useState('Users'));

function Users() {
  const [title, setTitle] = useUsers();

  return <input value={title} onChange={e => setTitle(e.target.value)} />;
}

export default Users;
