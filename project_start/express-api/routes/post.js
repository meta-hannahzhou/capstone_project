const express = require('express')
const router = express.Router()


const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.serverURL = "https://parseapi.back4app.com/"

router.post("/", async (req, res, next) => {
    try {
      const {selectedSongId, review, mood, rating} = req.body


      // add parse request here
      res.status(201).json({selectedSongId, review, mood, rating})
    } catch (err) {
      next(err)
    }
})

router.get("/:postObjectId", async (req, res, next) => {
    try {
    //   const {selectedSongId, review, mood, rating} = req.body
    //   res.status(200).json({selectedSongId, review, mood, rating})
    const review = "this song is great"
    res.status(200).json({selectedSongId, review, mood, rating})
    } catch (err) {
      next(err)
    }
})
