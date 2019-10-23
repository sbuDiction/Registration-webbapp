/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const all_list = document.querySelector('.list');
const which_town = document.querySelector('.town');
which_town.addEventListener('click', () => {
  const hideElement = document.querySelector('.plates_list');
  if (hideElement) {
    hideElement.classList.add('hide');
  }
});
