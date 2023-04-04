import { Provider } from "react-redux";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const payPalScriptProviderInitialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
};
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & {
  Component: {
    auth: boolean;
  };
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {Component.auth ? (
          <ProtectedLayout>
            <PayPalScriptProvider
              options={payPalScriptProviderInitialOptions}
              deferLoading={true}
            >
              <Component {...pageProps} />
            </PayPalScriptProvider>
          </ProtectedLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}

type ProtectedLayoutProps = {
  children: React.ReactElement;
};
const ProtectedLayout = ({ children }: ProtectedLayoutProps): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loading || !router.isReady) return;
    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (unAuthorized) {
      router.push({
        pathname: "/",
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return <>Loading app...</>;
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return authorized ? <div>{children}</div> : <></>;
};
