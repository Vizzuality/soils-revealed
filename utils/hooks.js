import { useState, useEffect, useRef } from 'react';
import useExtSWR from 'swr';

export const useDesktop = (minWidth = 992) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.screen.availWidth >= minWidth : true
  );

  useEffect(() => {
    let mediaQueryList;
    const onChange = mediaQuery => setIsDesktop(mediaQuery.matches);

    if (typeof window !== 'undefined') {
      mediaQueryList = window.matchMedia(`(min-width: ${minWidth}px)`);
      mediaQueryList.addListener(onChange);
    }

    return () => {
      if (mediaQueryList) {
        mediaQueryList.removeListener(onChange);
      }
    };
  }, [minWidth]);

  return isDesktop;
};

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

export const useSWR = (url, fetcher) => useExtSWR(url, fetcher, { revalidateOnFocus: false });

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
