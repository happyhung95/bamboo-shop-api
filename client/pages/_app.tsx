import React, { useEffect } from 'react'
import withRedux from 'next-redux-wrapper'
import { AppContext, AppInitialProps, AppProps } from 'next/app'
import Head from 'next/head'
import { Global, css } from '@emotion/core'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { ThemeProvider } from 'styled-components'

import { configureStore } from '../store/configureStore'
import { Menu } from '../components/molecules/Menu'
import { normalize } from '../constants/normalize'

type Props = { store: Store } & AppInitialProps & AppProps

type AppPage<P = {}> = {
  (props: P): JSX.Element | null
  getInitialProps: ({ Component, ctx }: AppContext) => Promise<AppInitialProps>
}

const theme = {
  primary: 'green',
}

const App: AppPage<Props> = ({ store, pageProps, Component }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles)
  }, [])

  return (
    <>
      <Head>
        <title>Bamboo Shop</title>
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Global
            styles={css`
              ${normalize}
            `}
          />
          <Menu />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
    },
  }
}

export default withRedux(configureStore)(App)
