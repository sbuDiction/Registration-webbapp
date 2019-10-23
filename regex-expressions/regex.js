/* eslint-disable no-trailing-spaces */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
module.exports = function Regex() {
  const start_with_regex = plate => {
    const regex = /[A-Z]{2}\s[0-9]{3}\s[0-9]{3}/gi;
    const test = regex.test(plate);
    return test;
  };

  const ends_with_regex = plate => {
    const regex = /[0-9]{3}\s[0-9]{3}\s[A-Z]{2}/gi;
    const test = regex.test(plate);
    return test;
  };
  
  return {
    start: start_with_regex,
    ends: ends_with_regex,
  };
};
