/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const assert = require('assert');
const pg = require('pg');
const Registration_numbers = require('../reg-numbers-manager/reg-function');

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL
  || 'postgresql://diction:19970823@localhost:5432/reg_number_tests';

let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const pool = new Pool({
  connectionString,
  ssl: useSSL,
});

// eslint-disable-next-line no-undef
describe('Registration numbers test', () => {
  // eslint-disable-next-line no-undef
  beforeEach(async () => {
    await pool.query('DELETE FROM numbers;');
    await pool.query('DELETE FROM towns;');
  });

  // eslint-disable-next-line no-undef
  it('Should able to add a plate numbers to database  ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('cape town', 'ca');
    await reg_number_instance.add_town('newcastle', 'nn');
    await reg_number_instance.add_town('bellvile', 'cy');
    await reg_number_instance.add_town('parrow', 'cj');
    await reg_number_instance.add('CA 123 123');
    await reg_number_instance.add('CY 123 123');
    await reg_number_instance.add('NN 123 123');
    await reg_number_instance.add('CJ 123 123');

    const plate_number = await reg_number_instance.get();
    assert.equal(4, plate_number.length);
  });

  it('Should able to add only plate numbers that exist on the database ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('bellvile', 'cy');
    await reg_number_instance.add_town('parrow', 'cj');
    await reg_number_instance.add('CY 123 123');
    await reg_number_instance.add('CJ 123 123');

    const plate_number = await reg_number_instance.get();
    assert.equal(2, plate_number.length);
  });

  it('Should able to add only plate numbers that are from Bellvile ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('bellvile', 'cy');
    await reg_number_instance.add('CY 123 123');
    await reg_number_instance.add('CY 124 123');
    await reg_number_instance.add('CY 124 124');
    const plate_number = await reg_number_instance.get();
    assert.equal(3, plate_number.length);
  });

  it('Should able to add only plate numbers that are from Cape Town ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('cape town', 'ca');
    await reg_number_instance.add('CA 123 123');
    await reg_number_instance.add('CA 124 123');
    await reg_number_instance.add('CA 124 124');
    const plate_number = await reg_number_instance.get();
    assert.equal(3, plate_number.length);
  });

  it('Should able to add only plate numbers that are from Parrow ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('parrow', 'cj');
    await reg_number_instance.add('CJ 123 123');
    await reg_number_instance.add('CJ 124 123');
    await reg_number_instance.add('CJ 124 124');
    const plate_number = await reg_number_instance.get();
    assert.equal(3, plate_number.length);
  });

  it('Should able to add only plate numbers that are from Newcastle ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('newcastle', 'nn');
    await reg_number_instance.add('NN 123 123');
    await reg_number_instance.add('NN 124 123');
    await reg_number_instance.add('NN 124 124');
    const plate_number = await reg_number_instance.get();
    assert.equal(3, plate_number.length);
  });

  it('Should able to add only plate numbers that are from Gauteng ', async () => {
    const reg_number_instance = Registration_numbers(pool);
    await reg_number_instance.add_town('gauteng', 'gp');
    await reg_number_instance.add('123 123 GP');
    await reg_number_instance.add('124 123 GP');
    await reg_number_instance.add('124 124 GP');
    const plate_number = await reg_number_instance.get();
    assert.equal(3, plate_number.length);
  });

  describe('Registration filter test', () => {
    it('Should able to show only plate numbers that are from Gauteng ', async () => {
      const reg_number_instance = Registration_numbers(pool);
      await reg_number_instance.add_town('gauteng', 'gp');
      await reg_number_instance.add('123 123 GP');
      await reg_number_instance.add('CA 124 123');
      await reg_number_instance.add('124 124 GP');
      await reg_number_instance.filter('0');
      const plate_number = await reg_number_instance.get()
      assert.equal(2, plate_number.length);
    });

    it('Should able to show only plate numbers that are from Cape Town ', async () => {
      const reg_number_instance = Registration_numbers(pool);
      await reg_number_instance.add_town('cape town', 'ca');
      await reg_number_instance.add('123 123 GP');
      await reg_number_instance.add('CA 124 123');
      await reg_number_instance.add('124 124 GP');
      await reg_number_instance.filter('0');
      const plate_number = await reg_number_instance.get()
      assert.equal(1, plate_number.length);
    });

    it('Should able to show only plate numbers that are from Bellvile ', async () => {
      const reg_number_instance = Registration_numbers(pool);
      await reg_number_instance.add_town('bellvile', 'cy');
      await reg_number_instance.add('123 123 GP');
      await reg_number_instance.add('CY 124 123');
      await reg_number_instance.add('CY 124 124');
      await reg_number_instance.add('124 124 GP');
      await reg_number_instance.filter('0');
      const plate_number = await reg_number_instance.get()
      assert.equal(2, plate_number.length);
    });

    it('Should able to show only plate numbers that are from Parrow ', async () => {
      const reg_number_instance = Registration_numbers(pool);
      await reg_number_instance.add_town('parrow', 'cj');
      await reg_number_instance.add('123 123 GP');
      await reg_number_instance.add('CJ 124 123');
      await reg_number_instance.add('CJ 124 133');
      await reg_number_instance.add('124 124 GP');
      await reg_number_instance.filter('0');
      const plate_number = await reg_number_instance.get()
      assert.equal(2, plate_number.length);
    });

    it('Should able to show only plate numbers that are from Newcastle ', async () => {
      const reg_number_instance = Registration_numbers(pool);
      await reg_number_instance.add_town('newcastle', 'nn');
      await reg_number_instance.add('123 123 GP');
      await reg_number_instance.add('NN 124 123');
      await reg_number_instance.add('NN 724 123');
      await reg_number_instance.add('124 124 GP');
      await reg_number_instance.filter('0');
      const plate_number = await reg_number_instance.get()
      assert.equal(plate_number.length, 2);
    });
    describe('Registration reset test', () => {
      it('Should able to reset the database and clear all reg numbers ', async () => {
        const reg_number_instance = Registration_numbers(pool);
        await reg_number_instance.add('123 123 GP');
        await reg_number_instance.add('NN 124 123');
        await reg_number_instance.add('NN 724 123');
        await reg_number_instance.add('124 124 GP');
        const plate_number = await reg_number_instance.delete();
        assert.equal(0, plate_number.length);
      });
    });    
    describe('Registration add town test', () => {
      it('Should able to add a new city to the database ', async () => {
        const reg_number_instance = Registration_numbers(pool);
        await reg_number_instance.add_town('sea point', 'cl');
        await reg_number_instance.add_town('cape town', 'ca');
        await reg_number_instance.add_town('vryheid', 'nv');
        await reg_number_instance.add_town('durban', 'nd');
        await reg_number_instance.add_town('nkandla', 'ka');
        await reg_number_instance.add_town('mpumalanga', 'mp');
        const plate_number = await reg_number_instance.list_all_towns();
        assert.equal(6, plate_number.length);
      });
    });    
  });
  // eslint-disable-next-line no-undef
  after(() => {
    pool.end();
  });
});
