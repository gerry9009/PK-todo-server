const correctDigit = require("./correctDigit.module");

module.exports = timeTemplate = () => {
  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    correctDigit(today.getMonth() + 1) +
    "-" +
    correctDigit(today.getDate());

  const time =
    correctDigit(today.getHours()) +
    ":" +
    correctDigit(today.getMinutes()) +
    ":" +
    correctDigit(today.getSeconds());

  return date + " " + time;
};
