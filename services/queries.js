/* eslint-disable no-trailing-spaces */
/* eslint-disable camelcase */
module.exports = function Queries(pool) {
  async function select_all() {
    const my_query = await pool.query('SELECT * FROM numbers');
    return my_query.rows;
  }

  async function select_towns_table() {
    const my_query = await pool.query('SELECT * FROM towns');
    return my_query.rows;
  }

  async function insert_data(town, id) {
    await pool.query('INSERT INTO numbers (plate_numbers,town_id) VALUES ($1,$2);', [town, id]);
  }

  async function reset() {
    const reset_data = await pool.query('DELETE FROM numbers');
    return reset_data.rows;
  }

  async function reset_towns() {
    const reset_data = await pool.query('DELETE FROM towns');
    return reset_data.rows;
  }
  
  
  async function add_towns(town, tag) {
    await pool.query('INSERT INTO towns (town,town_tag) VALUES ($1,$2)', [town, tag]);
  }
  return {
    select: select_all,
    insert: insert_data,
    town: select_towns_table,
    clear: reset,
    add_town: add_towns,
    clear_town: reset_towns,
  };
};
