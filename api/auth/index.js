const https = require('https');

module.exports = async function (context, req) {
  const userid = process.env.HIGHSPOT_USERID;
  const password = process.env.HIGHSPOT_PWD;

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

  const token = Buffer.from(`${userid}:${password}`).toString('base64');

  const options = {
    hostname: 'api.highspot.com',
    path: '/v1.0/me',
    method: 'GET',
    headers: {
      'Authorization': `Basic ${token}`,
      'Accept': 'application/json',
    },
    timeout: 10000,
  };

  try {
    const userData = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (parseErr) {
              reject(new Error('Failed to parse response JSON'));
            }
          } else {
            reject({
              status: res.statusCode,
              message: `Request failed with status ${res.statusCode}`,
              data,
            });
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      req.end();
    });

    context.log.info('Successfully retrieved user data from Highspot');
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, user: userData },
    };
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Unknown error';
    const errorData = err.data || 'No response data';

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
