export const user = (id, tags = [], user, date) => ({
  id,
  password: id,
  tags,
  user,
  date
});
