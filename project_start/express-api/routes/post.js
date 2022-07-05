const express = require('express')
const router = express.Router()
// const 

router.post("/", async (req, res, next) => {
    try {
      const {selectedSongId, review, mood, rating} = req.body


      // add parse request here
      res.status(201).json({selectedSongId, review, mood, rating})
    } catch (err) {
      next(err)
    }
})

router.get("/", async (req, res, next) => {
    try {
    //   const {selectedSongId, review, mood, rating} = req.body
    //   res.status(200).json({selectedSongId, review, mood, rating})
    const review = "this song is great"
    res.status(200).json({selectedSongId, review, mood, rating})
    } catch (err) {
      next(err)
    }
})
