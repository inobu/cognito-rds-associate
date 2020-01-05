const pg = require('pg');

const preparedStatement = 'INSERT INTO public.user (name, mail) VALUES($1, $2)';

const pool = new pg.Pool({
  user: process.env.user,
  password:  process.env.password,
  database: process.env.database,
  port: process.env.port,
  host: process.env.host
})

const commonErrorHandle = (err, event, context) => {
    console.log(err);
    context.fail(err, event);
}


exports.handler = async (event, context, callback) => {
  const insertValues = [event.userName, event.request.userAttributes.email];
  const client = await pool.connect().catch(err => commonErrorHandle(err, event, context))
  const result = await client.query(preparedStatement, insertValues).catch(err => commonErrorHandle(err, event, callback, context))
  context.done(null, event)
}