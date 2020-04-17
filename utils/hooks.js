import { useState, useEffect } from 'react';

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
