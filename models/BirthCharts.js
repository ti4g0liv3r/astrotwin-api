const mongoose = require("mongoose");

const BirthChart = mongoose.model("BirthChart", {
  userId: String,
  sun: String,
  moon: String,
  mercury: String,
  venus: String,
  mars: String,
  jupiter: String,
  saturn: String,
  uranus: String,
  neptune: String,
  pluto: String,
  lilith: String,
  chiron: String,
  ascendant: String,
  midheaven: String,
  houses: Array,
});

module.exports = BirthChart;
