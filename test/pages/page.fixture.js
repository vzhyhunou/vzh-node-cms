export const page = (id, tags = [], langs = [], user, date) => ({
  id,
  tags,
  title: langs.map((key) => ({ key, value: `${id}.${key}.title` })),
  content: langs.map((key) => ({ key, value: `${id}.${key}.content` })),
  user,
  date
});
