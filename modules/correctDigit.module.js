module.exports = correctDigit = (digit) => {
  return digit < 10 ? "0" + digit : String(digit);
};
