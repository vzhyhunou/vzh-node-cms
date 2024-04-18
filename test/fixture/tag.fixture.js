export const tag = (name) => ({
  name
});

export const delayedTag = (name) => ({
  name,
  start: new Date().setFullYear(new Date().getFullYear() + 1)
});

export const expiredTag = (name) => ({
  name,
  end: new Date().setFullYear(new Date().getFullYear() - 1)
});
