const axios = require('axios');

module.exports = async function (context, req) {
  try {
    const username = process.env.HIGHSPOT_USERID;
    const password = process.env.HIGHSPOT_PWD;

    if (!username || !password) {
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

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    context.log('Calling Highspot API...');

    const res = await axios.get('https://api.highspot.com/v1/spots', {
      headers: { Authorization: authHeader },
    });

    context.log('Highspot API response received');

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: true,
        count: res.data.objects?.length || 0,
        data: res.data.objects || [],
      },
    };
  } catch (err) {
    context.log('Error calling Highspot API:', err);

    const status = err.response?.status || 500;
    const errorData = err.response?.data || 'No response data';
    const errorHeaders = err.response?.headers || 'No headers';

    context.res = {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        message: err.message,
        error: errorData,
        headers: errorHeaders,
      },
    };
  }
};
