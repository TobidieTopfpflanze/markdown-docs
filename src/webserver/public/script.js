/**
 * @param el {HTMLElement}
 */
const openDropdown = (el) => {
  activeDropdown = el.querySelector('.dropdownContainer');
  activeDropdown.style.display =
    activeDropdown.style.display == 'block' ? 'none' : 'block';
};

const changePath = (path) => {
  window.location.pathname = path;
};
