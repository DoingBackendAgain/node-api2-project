const express = require("express")
const db = require("./data/db")

const router = express.Router()

router.get("/", (req,res)=> {
    res.json({
        message: "Hey this is your post router"
    })
})



router.post("/api/posts", (req,res, next)=> {
    try{
            newPost = {
                title: req.body.title,
                contents: req.body.contents
            }

            if(!req.body.title || !req.body.contents){
            return res.status(404).json({
                message: "Please include title and contents"
                })
            }
            else {
                db.insert(newPost)
                return res.status(201).json(newPost)
            }
            
        }
            catch(err){
                next(err)
        }

})

router.get("/api/posts", (req, res)=> {
    db.find(req.query)
        .then((posts)=> res.status(200).json(posts))
        .catch((err)=> {
            console.log(err)
            res.status(500).json({
                message: "The posts couldn't be fetched"
            })
        })
})


//  router.get("api/posts/:id", (req,res)=> {
//      const id = req.params;
//      db.findById(id)

//      .then((post)=> {
//         if (post.length === 0) {
//           res.status(404).json({
//                message: "no post" 
//             })
//         }
//         else {
//            res.json(post)
//         }
//      })
//      .catch(()=> {
//          console.log(err)
//          return res.status(500).json({
//              message: "OH NO!!! FIRE!!"
//          })
//      })
// })


router.post("/api/posts/:id/comments", (req, res)=> {
    const {id} = req.params;
    const {text} = req.body;
    const comment = {...req.body, post_id:id}

    if (!text) {
        res.status(400).json({
            message: "please provide text for comment"
        })
    }
    else {
        db.findById(id)
            .then((post)=> {
                if(!post.length){
                    res.status(404).json({
                        message: "The post with this ID doesn't exist"
                    });
                }
            })
    }
})


module.exports =router