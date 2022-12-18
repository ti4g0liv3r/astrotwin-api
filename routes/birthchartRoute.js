const express = require("express");
const router = express.Router();

const { jwtDecoder, checkToken, calculateBirthChart } = require("../utils");

const {
  createBirthChart,
  findBirthChartByUser,
  findBirthChartById,
  deleteBirthChart,
} = require("../queries");

///////////////////////////////////////////////////////
// -*-*- BIRTHCHART MANAGEMENT ROUTER -*-*-
//
// * PENDING TASKS HERE
//
// - ADD "ANNUAL PROFECTIONS" BASED ON ASCENDANT (FR)
//
///////////////////////////////////////////////////////

//BIRTHCHART CREATION

router.post("/calculate", checkToken, async (req, res) => {
  const { date, hour, minute, latitude, longitude } = req.body;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = calculateBirthChart(
    date,
    hour,
    minute,
    latitude,
    longitude,
    userId
  );

  const existingBirthchart = await findBirthChartByUser(userId);

  const newBirthChart = await createBirthChart(birthChart);

  //This needs to be refactored soon

  if (existingBirthchart) {
    if (newBirthChart) {
      return res
        .status(201)
        .json({ msg: "Birhchart calculated correctly", newBirthChart });
    } else {
      return res.status(500).json({ msg: "Couldn't generate birthchart" });
    }
  } else {
    return res.status(403).json({ msg: "User already has a birthchart" });
  }
});

router.get("/chart", checkToken, async (req, res) => {
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = await findBirthChartByUser(userId);

  if (birthChart.length !== 0) {
    return res.status(200).json({ birthChart });
  }

  return res.status(404).json({ msg: "No birthchart found" });
});

router.get("/chart/:birthChartId", checkToken, async (req, res) => {
  const birthChartId = req.params.birthChartId;

  const birthChart = await findBirthChartById(birthChartId);

  if (birthChart) {
    return res.status(200).json({ birthChart });
  }

  return res.status(404).json({ msg: "No birthchart found" });
});

router.delete("/:birthChartId", checkToken, async (req, res) => {
  const { birthChartId } = req.params;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = await findBirthChartByUser(userId);

  if (birthChart) {
    if (userId === birthChart[0].userId) {
      try {
        await deleteBirthChart(birthChartId);
        return res.status(200).json({ msg: "Birthchart deleted" });
      } catch (error) {
        return res
          .status(500)
          .json({ msg: "Couldn't delete birthchart", error });
      }
    }
  }

  return res.status(404).json({ msg: "Birthchart not found" });
});

///////////////////////////////////////////////////////

module.exports = router;
