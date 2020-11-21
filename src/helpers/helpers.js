const verifySize = (val) => {
  if (!val) return false;
  const sizeOf = val.size || val.length || Object.keys(val).length;

  return !sizeOf;
};

const verifyRegex = (reg, str) => {
  const regex = reg.test(str);

  return !regex;
};

const dataNormalized = (val) => {
  const normalized = val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Zs]/g, '')
    .toLowerCase();

  return normalized;
};

module.exports = {
  verifySize,
  verifyRegex,
  dataNormalized,
};
