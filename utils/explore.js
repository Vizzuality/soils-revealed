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

/* This function tracks the first time the app shows the recruitment modal to users */

export const isModalShown = () => {
  let modalShown = true;

  try {
    const storedValue = localStorage.getItem('showUserRecruitmentModal');
    modalShown = storedValue !== 'false';
  } catch (e) {
    console.error('Unable to access the localStorage.');
  }

  if (modalShown) {
    try {
      localStorage.setItem('showUserRecruitmentModal', 'false');
    } catch (e) {
      console.error('Unable to access the localStorage.');
    }
  }

  return modalShown;
};
