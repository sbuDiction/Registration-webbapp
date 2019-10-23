/* eslint-disable func-names */
/* eslint-disable camelcase */
require('../reg-numbers-manager/reg-function');

module.exports = function (instance) {
//   const instance = Factory_function();

  async function index(req, res) {
    const get_list = await instance.get();
    res.render('index', { title: 'Registration-Numbers' }, { plates: get_list });
  }

  async function add(req, res) {
    const { reg_number } = req.body.reg_plate;
    await instance.add(reg_number);
    res.redirect('/');
  }
  return {
    index_route: index,
    add_route: add,
  };
};
