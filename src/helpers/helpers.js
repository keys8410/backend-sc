const verifySize = (val) => {
  if (!val) return false;
  const sizeOf = val.size || val.length || Object.keys(val).length;

  return !sizeOf;
};

const verifyRegex = (reg, str) => {
  const regex = reg.test(str);

  return !regex;
};

module.exports = {
  verifySize,
  verifyRegex,
};
