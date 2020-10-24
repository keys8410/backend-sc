const size = (val) => {
  if (!val) return false;
  const sizeOf = val.size || val.length || Object.keys(val).length;

  return !sizeOf;
};

module.exports = size;
