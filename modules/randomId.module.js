module.exports = getRandomId = (data) => {
  const existingIds = data.map((item) => item.id);
  existingIds.sort((a, b) => a - b);

  for (let i = 0; i < existingIds.length; i++) {
    if (existingIds[i] + 1 !== existingIds[i + 1]) {
      return i + 2;
    }
  }

  return existingIds.length + 1;
};
