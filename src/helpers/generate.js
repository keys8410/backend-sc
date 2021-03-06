const generator = require('generate-password');

const generateUsername = (string) => {
  const splited = string.split(' ');
  const { length } = splited;

  const user = splited;
  const newUser = `${user[0]}.${user[length - 1]}`;

  const randomNumber = Math.floor(Math.random() * 999) + 1;

  return `${newUser.toLowerCase()}-${randomNumber}`;
};

const generatePassword = () => {
  return generator.generate({
    length: 8,
    numbers: true,
    uppercase: false,
    excludeSimilarCharacters: true,
  });
};

module.exports = { generateUsername, generatePassword };
