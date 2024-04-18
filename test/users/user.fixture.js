export const user = (id, tags = [], user) => ({
  id,
  password: id,
  tags,
  user
});
