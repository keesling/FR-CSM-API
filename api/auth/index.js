const axios = require('axios');

module.exports = async function (context, req) {
  const username = process.env.HIGHSPOT_USERID;
  const password = process.env.HIGHSPOT_PWD;

  if (!username || !password) {
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { success: false, message: 'Missing Highspot credentials' },
    };
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const res = await axios.get('https://api.highspot.com/v1.0/users/me', {
      headers: { Authorization: authHeader },
    });

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, user: res.data },
    };
  } catch (err) {
    context.res = {
      status: err.response?.status || 500,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        message: err.message,
        error: err.response?.data || 'No response data',
      },
    };
  }
};
