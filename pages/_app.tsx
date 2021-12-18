import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../styles/createEmotionCache';

import "/styles/globals.css";
import theme from '../styles/theme';

import { store, persistor } from '../redux/store';
import { Provider as ReduxProvider } from 'react-redux';

import { AuthProvider } from '../utils/authProvider';

import { PersistGate } from 'redux-persist/integration/react'


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {


  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </PersistGate>
        </ReduxProvider>
      </AuthProvider>
    </CacheProvider>
  );
};

export default App;