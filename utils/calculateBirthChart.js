const { Origin, Horoscope } = require("circular-natal-horoscope-js");

//////////
// Origin
//////////
// This class automatically derives the local timezone from latitude/longitude coordinates
// and calculates UTC time with respect to timezone and historical daylight savings time.
// Only works for C.E. date (> 0).
/////////
// * int year: value >= 0 C.E.
// * int month: (0 = january ...11 = december)
// * int date: (1...31)
// * int hours = local time - hours value (0...23)
// * int minute = local time - minute value (0...59)
// * float latitude = latitude in decimal format (-90.00...90.00)
// * float longitude = longitude in decimal format (-180.00...180.00)

// December 1st, 2020 - 430pm

const calculateBirthChart = (
  date,
  hour,
  minute,
  latitude,
  longitude,
  userId
) => {
  const year = date.split("-")[0];
  const month = date.split("-")[1] - 1;
  const day = date.split("-")[2];

  const origin = new Origin({
    year: year,
    month: month, // 0 = January, 11 = December!
    date: day,
    hour: hour,
    minute: minute,
    latitude: latitude,
    longitude: longitude,
  });

  const horoscope = new Horoscope({
    origin: origin,
    houseSystem: "whole-sign",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major", "minor"],
    customOrbs: {},
    language: "en",
  });

  const houses = horoscope.Houses.map((house) => {
    return {
      house: house.id,
      sign: house.Sign.key,
    };
  });

  const birthChart = {
    userId: userId,
    sun: horoscope.CelestialBodies.sun.Sign.key,
    moon: horoscope.CelestialBodies.moon.Sign.key,
    mercury: horoscope.CelestialBodies.mercury.Sign.key,
    venus: horoscope.CelestialBodies.venus.Sign.key,
    mars: horoscope.CelestialBodies.mars.Sign.key,
    jupiter: horoscope.CelestialBodies.jupiter.Sign.key,
    saturn: horoscope.CelestialBodies.saturn.Sign.key,
    uranus: horoscope.CelestialBodies.uranus.Sign.key,
    neptune: horoscope.CelestialBodies.neptune.Sign.key,
    pluto: horoscope.CelestialBodies.pluto.Sign.key,
    lilith: horoscope.CelestialPoints.lilith.Sign.key,
    chiron: horoscope.CelestialBodies.chiron.Sign.key,
    ascendant: horoscope.Ascendant.Sign.key,
    midheaven: horoscope.Midheaven.Sign.key,
    houses,
  };

  return birthChart;
};

module.exports = calculateBirthChart;
