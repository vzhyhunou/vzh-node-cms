export const page = (id, tags = [], langs = [], user, date) => ({
  id,
  tags,
  title: langs.map((lang) => ({ lang, value: `${id}.${lang}.title` })),
  content: langs.map((lang) => ({ lang, value: `${id}.${lang}.content` })),
  user,
  date
});
