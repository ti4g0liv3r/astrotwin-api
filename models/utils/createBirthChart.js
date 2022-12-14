const BirthChart = require("../BirthCharts");

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

  try {
    await newBirthchart.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = createBirthChart;
