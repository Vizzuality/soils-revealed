import Airtable from 'airtable';

const { AIRTABLE_API_KEY: API_KEY } = process.env;
const { AIRTABLE_USER_ID: USER_ID } = process.env;

const USERS_TABLE = 'Soils-Recruitment-2021';

const userResearchBase = new Airtable({
  apiKey: API_KEY,
}).base(USER_ID);
const createUserEntry = userData => {
  return new Promise((resolve, reject) => {
    userResearchBase(USERS_TABLE).create([{ fields: userData }], (error, records) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(records);
    });
  });
};

const updateUserEntry = (id, userData) => {
  return new Promise((resolve, reject) => {
    userResearchBase(USERS_TABLE).update([{ id, fields: userData }], (error, records) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(records);
    });
  });
};

export { createUserEntry, updateUserEntry };
