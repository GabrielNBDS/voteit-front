import React from 'react'

import AppProvider from '../hooks/index'
import { ChakraProvider } from '@chakra-ui/core'
import Head from 'next/head'
import { AppProps } from 'next/app'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Head>
        <title>voteit</title>
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AppProvider>
  )
}

export default MyApp
