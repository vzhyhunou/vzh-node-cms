export const config = () => ({
  jwt: {
    expiration: parseInt(process.env.JWT_EXPIRATION, 10),
    secret: process.env.JWT_SECRET,
    roles: process.env.JWT_ROLES
  }
});
