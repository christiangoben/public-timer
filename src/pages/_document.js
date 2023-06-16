import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <title>TimeSync</title>
      <Head>
        <link rel="icon" href="/favicon.ico" />    
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}