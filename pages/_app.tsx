import type { AppProps } from 'next/app';
import { useReducer } from 'react';

import { initialContext } from '../constants/context';
import { Reducer, Store } from '../context';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(Reducer, initialContext['state']);

  return (
    <Store.Provider value={{state, dispatch}}>
      <Component {...pageProps} />
    </Store.Provider>
  )
}

export default MyApp
