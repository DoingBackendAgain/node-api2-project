const express = require("express")
const db = require("./data/db")

const router = express.Router()

router.get("/", (req,res)=> {
    res.json({
        message: "Hey this is your post router"
    })
})

router.post("/api/posts", (req,res)=> {

    if(!req.body.title || !req.body.contents){
    return res.status(404).json({
        message: "Please include title and contents"
    })
    }

    db.insert(req.body)
        .then((post)=> {
            res.status(201).json(post)
        })
        .catch((err)=> {
            console.log(err)
            return res.status(500).json({
                message: "error adding post"
            })
        })

})



module.exports =router