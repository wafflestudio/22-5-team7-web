import './reset.css';

import { useReducer } from 'react';

export const App = () => {
  const [count, increment] = useReducer((c: number) => c + 1, 0);

  return <button onClick={increment}>{count}</button>;
};
