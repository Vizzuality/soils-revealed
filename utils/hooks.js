import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';

export const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    let mediaQueryList;
    const onChange = mediaQuery => setIsDesktop(mediaQuery.matches);

    if (typeof window !== 'undefined') {
      mediaQueryList = window.matchMedia('(min-width: 992px)');
      mediaQueryList.addListener(onChange);
    }

    return () => {
      if (mediaQueryList) {
        mediaQueryList.removeListener(onChange);
      }
    };
  }, []);

  return isDesktop;
};

export { default as useSWR } from 'swr';

export const useStickySWR = (url, fetcher) => {
  const res = useRef();
  const { data, ...rest } = useSWR(url, fetcher);

  if (data !== undefined) {
    res.current = data;
  }

  return {
    ...rest,
    data: res.current,
  };
};
