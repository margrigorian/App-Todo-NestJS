export default () => ({
  port: process.env.PORT,
  database: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
});
