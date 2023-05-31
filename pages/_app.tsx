import { Router } from "next/router";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import nProgress from "nprogress";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", () => {
     nProgress.done(false);
});
function MyApp({ Component, pageProps }: AppProps) {
     return <Component {...pageProps} />;
}

export default MyApp;
