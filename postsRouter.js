const express = require("express")
const db = require("./data/db")

const router = express.Router()

router.get("/", (req,res)=> {
    res.json({
        message: "Hey this is your post router"
    })
})



module.exports =router