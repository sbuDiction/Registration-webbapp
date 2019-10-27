/* eslint-disable no-trailing-spaces */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
module.exports = function Regex() {
  const start_with_regex = plate => {
    const regex = /^[A-Z]{2}\s[0-9]{3}\s[0-9]{3}$/gi;
    const test = regex.test(plate);
    return test;
  };

  const ends_with_regex = plate => {
    const regex = /^[0-9]{3}\s[0-9]{3}\s[A-Z]{2}$/gi;
    const test = regex.test(plate);
    return test;
  };

  const adds_hyphen = plate => {
    const regex = /^[A-Z]{2}\s[0-9]{3}\S[0-9]{3}$/gi;
    const test = regex.test(plate);
    return test;
  };

  const three_chars = plate => {
    const regex = /^[A-Z]{2}\s[0-9]{3}$/gi;
    const test = regex.test(plate);
    return test;
  };

  const four_chars = plate => {
    const regex = /^[A-Z]{2}[0-9]{4}$/gi;
    const test = regex.test(plate);
    return test;
  };

  const town_tag_regex = tag => {
    const regex = /^[A-Z]{2}$/i;
    const test = regex.test(tag);
    return test;
  };

  return {
    start: start_with_regex,
    ends: ends_with_regex,
    tag: town_tag_regex,
    hyphen: adds_hyphen,
    three: three_chars,
    four: four_chars
  };
};
