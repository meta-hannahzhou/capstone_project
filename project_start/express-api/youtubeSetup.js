var google = require("googleapis");
const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyCUySF3Hfii_MpUUGHtKOzdI4uVtB51raE",
});

module.exports = youtube;
