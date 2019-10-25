/* eslint-disable semi */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
require('../reg-numbers-manager/reg-function');

module.exports = function (instance) {

  async function index(req, res) {
    res.render('index', {
      title: 'Registration-Numbers',
      plates: await instance.get(),
      drop_down: await instance.list_all_towns(),
      error_message: instance.errors(),
      success_messsage: instance.success(),
    });
  }

  async function add(req, res) {
    const reg_number = req.body.reg_plate;
    await instance.add(reg_number);
    res.redirect('/');
  }

  async function add_town(req, res) {
    const town = req.body.town_name;
    const tag = req.body.city_tag;
    await instance.add_town(town, tag);
    res.redirect('/');
  }

  async function filter_for_town(req, res) {
    const starts = req.body.town;
    await instance.filter(starts);
    res.redirect('/');
  }

  async function reset(req, res) {
    await instance.delete();
    res.redirect('/');
  }

  async function reset_towns(req, res) {
    await instance.remove_towns();
    res.redirect('/');
  }

  return {
    index_route: index,
    add_route: add,
    town: add_town,
    filter: filter_for_town,
    delete: reset,
    delete_towns: reset_towns,
  };
};
