const express = require('express')
const router = express.Router()

// const {key} = require('authentication')

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.serverURL = "https://parseapi.back4app.com/"

router.get("/most-liked", async (req, res, next) => {
    try {
        
      } catch (err) {
        next(err)
      }
})