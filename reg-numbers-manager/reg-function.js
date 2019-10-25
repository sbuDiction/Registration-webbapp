/* eslint-disable prefer-const */
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
  let filert_any_town;
  let err_message = '';
  let success_message = '';

  async function add_reg_number(number) {
    err_message = ''
    success_message = ''
    const plate_number = number;
    const towns_data = await queries.town();
    const select_plate = await pool.query('SELECT * FROM numbers WHERE plate_numbers = $1', [plate_number]);
    if (expression_test.start(plate_number) === true || expression_test.ends(plate_number) === true) {
      if (select_plate.rows.length !== 0) {
        err_message = 'Licence plate already exist!'
        return true;
      }
      for (let i = 0; i < towns_data.length; i++) {
        const { town_tag } = towns_data[i];
        if (plate_number.startsWith(town_tag) || plate_number.endsWith(town_tag)) {
          success_message = 'License plate added'
          await queries.insert(plate_number, towns_data[i].id);
        }else{
          err_message = 'Please add town for that license plate!'
        }
      }
    }else{
      err_message = 'Invalid licence plate please try again!'
    }
  }

  async function get_all_plate_numbers() {
    let get_town;
    const plate_numbers = await queries.select();
    if(filert_any_town !== '0' && filert_any_town !== undefined){
      get_town = await pool.query('SELECT * FROM numbers WHERE town_id = $1', [filert_any_town])
      return get_town.rows
    } else {
      return plate_numbers;
    }
  }

  async function get_all_towns() {
    const towns = await queries.town();
    return towns;
  }

  async function filter_reg_numbers(town_id) {
    filert_any_town = town_id
  }

  async function reset_database() {
    const reset_data = await queries.clear();
    success_message = 'succesfully reseted license plates database'
    return reset_data;
  }

  async function reset_towns() {
    const reset_data = await queries.clear_town();
    success_message = 'succesfully reseted towns database'
    return reset_data;
  }

  async function add_towns(town, tag) {
    const is_town = town.charAt(0).toUpperCase() + town.slice(1).toLowerCase();
    const is_tag = tag.toUpperCase();
    const select_all_towns = await pool.query('SELECT * FROM towns WHERE town = $1', [is_town],);
    if (select_all_towns.rows.length !== 0) {
      err_message = 'Town already exist!'
      return true;
    }
    const towns_data = await queries.town();
    for (let x = 0; x < towns_data.length; x++) {
      const element = towns_data[x].town_tag;
      if (is_tag.trim() === element) {
        return true;
      }
    }
    success_message = 'Town has been added'
    await queries.add_town(is_town, is_tag);
  }

  const display_error_message = () => err_message;

  const display_success_mesages = () => success_message;

  return {
    add: add_reg_number,
    get: get_all_plate_numbers,
    filter: filter_reg_numbers,
    delete: reset_database,
    add_town: add_towns,
    list_all_towns: get_all_towns,
    remove_towns: reset_towns,
    errors: display_error_message,
    success: display_success_mesages,
  };
};
