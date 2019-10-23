/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
const Services = require('../services/queries');
const Regex = require('../regex-expressions/regex');

module.exports = function Reg_numbers(pool) {
  const queries = Services(pool);
  const expression_test = Regex();
  
  let filtered_results = [];
  async function add_reg_number(number) {
    const plate_number = number.toUpperCase();
    const towns_data = await queries.town();
    const select_plate = await pool.query('SELECT * FROM numbers WHERE plate_numbers = $1', [plate_number]);
    if (expression_test.start(plate_number) === true || expression_test.ends(plate_number) === true) {
      if (select_plate.rows.length !== 0) {
        return true;
      }
      for (let i = 0; i < towns_data.length; i++) {
        const { town_tag } = towns_data[i];
        if (plate_number.startsWith(town_tag) || plate_number.endsWith(town_tag)) {
          await queries.insert(plate_number, towns_data[i].id);
        }
      }
    }
  }

  async function get_all_plate_numbers() {
    const plate_numbers = await queries.select();
    return plate_numbers;
  }

  async function get_all_towns() {
    const towns = await queries.town();
    return towns;
  }
  
  async function filter_reg_numbers(town_tag) {
    filtered_results = [];
    const towns = await queries.select();
    if (town_tag === undefined || town_tag === '') {
      return towns;
    }
    for (let x = 0; x < towns.length; x++) {
      const element = towns[x].plate_numbers;
      if (element.startsWith(town_tag)) {
        filtered_results.push(element);
      } else if (element.endsWith(town_tag)) {
        filtered_results.push(element);
      }  
    }
    return filtered_results;
  }

  async function reset_database() {
    const reset_data = await queries.clear();
    return reset_data;
  }

  async function add_towns(town, tag) {
    const is_town = town.charAt(0).toUpperCase() + (town.slice(1)).toLowerCase();
    const is_tag = tag.toUpperCase();
    const select_all_towns = await pool.query('SELECT * FROM towns WHERE town = $1', [is_town]);
    if (select_all_towns.rows.length !== 0) {
      return true;
    }
    const towns_data = await queries.town();
    for (let x = 0; x < towns_data.length; x++) {
      const element = towns_data[x].town_tag;
      if (is_tag === element) {
        return true;
      }
    }
    await queries.add_town(is_town, is_tag);
  }

  return {
    add: add_reg_number,
    get: get_all_plate_numbers,
    filter: filter_reg_numbers,
    delete: reset_database,
    add_town: add_towns,
    list_all_towns: get_all_towns,
  };
};
