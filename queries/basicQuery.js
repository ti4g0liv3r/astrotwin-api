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

const findOne = async (model, query) => {
  const object = await model
    .findOne(query)
    .then((res) => res)
    .catch((err) => err);
  return object;
};

const findAll = async (model, query) => {
  const { dbQuery, options } = query;
  const object = await model
    .find(dbQuery, options)
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

module.exports = {
  save,
  find,
  findById,
  findAll,
  findOne,
  deleteOne,
  updateOne,
};
