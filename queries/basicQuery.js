const save = async (model) => {
  const object = await model
    .save()
    .then((res) => res)
    .catch((err) => err);
  return object;
};

const find = async (model, query) => {
  const object = await model
    .find(query)
    .then((res) => res)
    .catch((err) => err);
  return object;
};

const findById = async (model, query) => {
  const { id, option } = query;
  const object = await model
    .findById(id, option)
    .then((res) => res)
    .catch((err) => err);
  return object;
};

const deleteOne = async (model, query) => {
  const object = await model
    .deleteOne(query)
    .then((res) => res)
    .catch((err) => err);

  return object;
};

const updateOne = async (model, query) => {
  const object = await model
    .updateOne(query)
    .then((res) => res)
    .catch((err) => err);

  return object;
};

module.exports = { save, find, findById, deleteOne, updateOne };
