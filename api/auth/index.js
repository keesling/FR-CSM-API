module.exports = async function (context, req) {
  context.log('Simple Azure Function triggered');

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      success: true,
      message: 'Function executed successfully',
    },
  };
};
