export const page = (id, tags = [], langs = [], user, date) => ({
  id,
  tags,
  title: langs.map((lang) => ({ lang, title: `${id}.${lang}.title` })),
  content: langs.map((lang) => ({ lang, content: `${id}.${lang}.content` })),
  user,
  date
});
