const express = require("express");
const router = express.Router();

const { jwtDecoder, checkToken, calculateBirthChart } = require("../utils");

const {
  createBirthChart,
  findBirthChart,
  deleteBirthChart,
} = require("../queries");

///////////////////////////////////////////////////////
// -*-*- BIRTHCHART MANAGEMENT ROUTER -*-*-
//
// * PENDING TASKS HERE
//
// - ADD A ROUTE TO GET BIRTHCHART BY ID
// - REFACTOR BIRTHCHART CALCULATION LOGIC
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

  const existingBirthchart = await findBirthChart(userId);

  //This needs to be refactored soon

  if (existingBirthchart.length == 0) {
    if (birthChart) {
      try {
        await createBirthChart(birthChart);
        return res
          .status(201)
          .json({ msg: "Birhchart calculated correctly", birthChart });
      } catch (error) {
        console.log("Couldn't create birthchart");
        return res.status(500).json({ msg: "Couldn't created birthchart" });
      }
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

  const birthChart = await findBirthChart(userId);

  if (birthChart.length !== 0) {
    return res.status(200).json({ birthChart });
  }

  return res.status(404).json({ msg: "No birthchart found" });
});

router.delete("/:birthChartId", checkToken, async (req, res) => {
  const { birthChartId } = req.params;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = await findBirthChart(userId);

  if (birthChart.length !== 0) {
    if (userId === birthChart[0].userId) {
      try {
        await deleteBirthChart(birthChartId);
        return res.status(200).json({ msg: "Birthchart deleted" });
      } catch (error) {
        console.log("Couldn't delete birthchart", error);
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
