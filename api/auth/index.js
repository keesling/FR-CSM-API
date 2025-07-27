const axios = require('axios');

module.exports = async function (context, req) {
  const userid = process.env.HIGHSPOT_USERID;
  const password = process.env.HIGHSPOT_PWD;

  // Validate credentials
  if (!userid || !password) {
    context.log('Missing Highspot credentials');
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        message: 'Missing Highspot credentials',
      },
    };
    return;
  }

  // Encode credentials for Basic Auth
  const token = Buffer.from(`${userid}:${password}`).toString('base64');

  try {
    const res = await axios.get('https://api.highspot.com/v1.0/me', {
      headers: {
        'Authorization': `Basic ${token}`,
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    context.log.info('Successfully retrieved user data from Highspot');
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, user: res.data },
    };
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || 'No response data';
    const message = err.message || 'Unknown error';

    context.log.error(`Highspot API error: ${message}`, errorData);

    context.res = {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        message,
        error: errorData,
      },
    };
  }
};
