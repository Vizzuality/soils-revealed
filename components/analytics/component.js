import React from 'react';
import Head from 'next/head';
import { useCookieConsentContext } from '@use-cookie-consent/react';

const Analytics = () => {
  const { consent } = useCookieConsentContext();

  if (!consent.thirdParty || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Head>
      <script
        id="gtm-script"
        async
        defer
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_KEY}`}
      />
      <script id="gtm-config-script" async defer>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GOOGLE_ANALYTICS_KEY}');
        `}
      </script>
    </Head>
  );
};

export default Analytics;
