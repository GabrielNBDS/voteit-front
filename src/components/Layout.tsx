import React from 'react'
import Head from 'next/head'

const Layout: React.FC<{ title: string }> = ({
  children,
  title = 'voteit'
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  )
}

export default Layout
