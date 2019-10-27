/* eslint-disable prefer-let */
/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
let Services = require("../services/queries");
let Regex = require("../regex-expressions/regex");

module.exports = function Reg_numbers(pool) {
  let queries = Services(pool);
  let expression_test = Regex();
  let filert_any_town;
  let err_message = "";
  let success_message = "";

  async function add_reg_number(number) {
    err_message = "";
    success_message = "";
    let plate_number = number.toUpperCase();
if(plate_number){
  if (expression_test.start(plate_number) || expression_test.ends(plate_number) ||
  expression_test.hyphen(plate_number) || expression_test.three(plate_number) || expression_test.four(plate_number)) {
    
        let towns_data = await queries.town();
        let select_plate = await pool.query("SELECT * FROM numbers WHERE plate_numbers = $1",[plate_number]);
      
      if (select_plate.rows.length !== 0) {
        err_message = "Licence plate already exist!";
        return true;
      }
      
      for (let i = 0; i < towns_data.length; i++) {
        if (plate_number.startsWith(towns_data[i].town_tag) || plate_number.endsWith(towns_data[i].town_tag)) {
          success_message = "License plate added";
          await queries.insert(plate_number, towns_data[i].id);
          return true;
        }
      }
      return (err_message = "Please add town for that license plate!");
    } 
      else {
        err_message = "Invalid licence plate please try again!";
    }
  }
    else {
      err_message = 'Please enter license plate!'
  }
  }

  async function get_all_plate_numbers() {
    let get_town;
    let plate_numbers = await queries.select();
    if (filert_any_town !== "0" && filert_any_town !== undefined) {
      get_town = await pool.query("SELECT * FROM numbers WHERE town_id = $1", [filert_any_town]);
      return get_town.rows;
    } else {
      return plate_numbers;
    }
  }

  async function get_all_towns() {
    let towns = await queries.town();
    console.log(towns);
    
    return towns;
  }

  async function filter_reg_numbers(town_id) {
    err_message = "";
    success_message = "";
    console.log(town_id);
    
    filert_any_town = town_id;
  }

  async function reset_database() {
    let reset_data = await queries.clear();
    err_message = "";
    success_message = "succesfully reseted license plates database";
    return reset_data;
  }

  async function reset_towns() {
    let reset_data = await queries.clear_town();
    err_message = "";
    success_message = "succesfully reseted towns database";
    return reset_data;
  }

  async function add_towns(town, tag) {
    err_message = "";
    success_message = "";
    let is_town = town.charAt(0).toUpperCase() + town.slice(1).toLowerCase();
    let is_tag = tag.toUpperCase();

    if (expression_test.tag(is_tag)) {
      let select_all_towns = await pool.query("SELECT * FROM towns WHERE town = $1", [is_town]);
      if (select_all_towns.rows.length !== 0) {
        err_message = "Town already exist!";
        return true;
      }
      let towns_data = await queries.town();
      for (let x = 0; x < towns_data.length; x++) {
        let element = towns_data[x].town_tag;
        if (is_tag === element) {
          return true;
        }
      }
      success_message = "Town has been added";
      await queries.add_town(is_town, is_tag);
    } else {
      err_message = "Sorry only two letters are required!";
    }
  }

  let display_error_message = () => err_message;

  let display_success_mesages = () => success_message;

  return {
    add: add_reg_number,
    get: get_all_plate_numbers,
    filter: filter_reg_numbers,
    delete: reset_database,
    add_town: add_towns,
    list_all_towns: get_all_towns,
    remove_towns: reset_towns,
    errors: display_error_message,
    success: display_success_mesages
  };
};