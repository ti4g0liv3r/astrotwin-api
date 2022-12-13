const getZodiac = (birthdate) => {
  let day = birthdate.split("-")[2];
  let month = birthdate.split("-")[1];
  let year = birthdate.split("-")[0];

  switch (month) {
    case "01":
      return day <= 20 ? "capricorn" : "aquarius";
    case "02":
      return day <= 18 ? "aquarius" : "piscis";
    case "03":
      return day <= 20 ? "piscis" : "aries";
    case "04":
      return day <= 20 ? "aries" : "taurus";
    case "05":
      return day <= 20 ? "taurus" : "gemini";
    case "06":
      return day <= 20 ? "gemini" : "cancer";
    case "07":
      return day <= 22 ? "cancer" : "leo";
    case "08":
      return day <= 22 ? "leo" : "virgo";
    case "09":
      return day <= 22 ? "virgo" : "libra";
    case "10":
      return day <= 22 ? "libra" : "escorpio";
    case "11":
      return day <= 21 ? "escorpio" : "sagittarius";
    case "12":
      return day <= 21 ? "sagittarius" : "capricorn";
    default:
      return null;
  }
};

module.exports = getZodiac;
