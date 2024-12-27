import '../src/app/globals.css'
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <body>
      <Component {...pageProps} />
    </body>

  );
}

export default MyApp;