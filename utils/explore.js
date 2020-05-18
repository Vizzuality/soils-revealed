/**
 * Return whether the user is visiting Explore for the first time
 * NOTE: This function is not pure. After being called, it will return false.
 */
export const isFirstVisit = () => {
  let isFirstVisit = true;

  try {
    const storedValue = localStorage.getItem('firstVisit');
    isFirstVisit = storedValue !== 'false';
  } catch (e) {
    console.error('Unable to access the localStorage.');
  }

  if (isFirstVisit) {
    try {
      localStorage.setItem('firstVisit', 'false');
    } catch (e) {
      console.error('Unable to access the localStorage.');
    }
  }

  return isFirstVisit;
};
