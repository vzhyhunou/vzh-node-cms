export const tag = (name) => ({
  name
});

export const delayedTag = (name) => {
  const start = new Date();
  start.setFullYear(start.getFullYear() + 1);
  return {
    name,
    start
  };
};

export const expiredTag = (name) => {
  const end = new Date();
  end.setFullYear(end.getFullYear() - 1);
  return {
    name,
    end
  };
};
