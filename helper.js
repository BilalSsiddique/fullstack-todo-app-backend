const validateTodos = ({ title, desc, checked, date }) => {
  if ((title==undefined, desc===undefined, checked===undefined)) {
    return false;
  }
  if (
    title.trim().length === 0 &&
    desc.trim().length === 0 &&
    checked.trim().length === 0
  ) {
    return false;
  }

  return true;
};

module.exports = validateTodos;
