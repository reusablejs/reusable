import React from 'react';
import { createStore } from 'reusable';
import { useState } from 'react';

const useHome = createStore(() => useState('Home'));

function Home() {
  const [title, setTitle] = useHome();
  return (<div>
    {/* {arr.map((i) => <Comp key={i} />)} */}
    <input value={title} onChange={e => setTitle(e.target.value)} />
  </div>);
}

export default Home;
