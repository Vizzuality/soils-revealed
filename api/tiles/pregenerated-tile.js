const axios = require('axios').default;

module.exports = async params => {
  const url = encodeURI(`${process.env.TILES_URL}/${params.join('/')}.png`);

  const { data } = await axios.get(url, {
    headers: { Accept: 'image/*' },
    responseType: 'arraybuffer',
  });

  return data;
};
