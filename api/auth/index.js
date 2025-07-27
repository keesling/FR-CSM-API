module.exports = async function (context, req) {
  const name = req.query.name || (req.body && req.body.name) || 'World';
  context.res = {
    status: 200,
    body: { message: `Hello, ${name}! This is your Azure Function.` },
  };
};
