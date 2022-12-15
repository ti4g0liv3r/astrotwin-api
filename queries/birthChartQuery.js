const BirthChart = require("../models/BirthCharts");

const findBirthChart = async (userId) => {
  try {
    const birthChart = await BirthChart.find({ userId: userId });
    return birthChart;
  } catch (error) {
    console.log("No birthchart found");
  }
};

const deleteBirthChart = async (birthChartID) => {
  try {
    const birthChart = await BirthChart.deleteOne({ _id: birthChartID });
    return birthChart;
  } catch (error) {
    console.log("Couldn't delete birthchart", error);
  }
};

module.exports = { findBirthChart, deleteBirthChart };
