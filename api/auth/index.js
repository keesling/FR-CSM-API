
const axios = require('axios');


module.exports = async function (context, req) {
  const username = process.env.HIGHSPOT_USERID;
  const password = process.env.HIGHSPOT_PWD;

  if (!username || !password) {
    context.res = { status: 500, body: 'Missing Highspot credentials' };
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const res = await axios.get('https://api.highspot.com/v1/spots', {
      headers: { Authorization: authHeader },
    });
    context.res = { status: 200, body: { success: true, count: res.data.objects?.length || 0 } };
  } catch (err) {
    context.res = {
      status: err.response?.status || 500,
      body: { success: false, error: err.message },
    };
  }
};
