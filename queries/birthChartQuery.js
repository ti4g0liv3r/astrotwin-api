const BirthChart = require("../models/BirthCharts");
const { save, find, deleteOne } = require("./basicQuery");

const createBirthChart = async (birthChart) => {
  const newBirthchart = new BirthChart({
    userId: birthChart.userId,
    sun: birthChart.sun,
    moon: birthChart.moon,
    mercury: birthChart.mercury,
    venus: birthChart.venus,
    mars: birthChart.mars,
    jupiter: birthChart.jupiter,
    saturn: birthChart.saturn,
    uranus: birthChart.uranus,
    neptune: birthChart.neptune,
    pluto: birthChart.pluto,
    lilith: birthChart.lilith,
    chiron: birthChart.chiron,
    ascendant: birthChart.ascendant,
    midheaven: birthChart.midheaven,
    houses: birthChart.houses,
  });

  await save(newBirthchart);
  return newBirthchart;
};

const findBirthChart = async (userId) => {
  const birthChart = await find(BirthChart, { userId: userId });
  return birthChart;
};

const deleteBirthChart = async (birthChartID) => {
  const birthChart = await deleteOne(BirthChart, { _id: birthChartID });
  return birthChart;
};

module.exports = { createBirthChart, findBirthChart, deleteBirthChart };
