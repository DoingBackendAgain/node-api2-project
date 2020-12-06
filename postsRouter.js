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

router.get("/api/posts/:id/comments", (req,res)=> {
    db.findPostComments(req.params.id)
        .then((comment)=> {
            if(comment){
                res.status(200).json(comment)
            }
            else {
                res.status(400).json({
                    message: "The post with that ID doesn't exisit"
                })
            }
        })
        .catch((err)=> {
            return res.status(500).json({
                message: "The comment information couldn't be found"
            })
        })
})

router.put('/api/posts/:id', (req, res) => {

 
    if(!req.body.title || !req.body.contents){
         return res.status(400).json({
             message: "missing body"
         })
     }
 
     db.update(req.params.id, req.body)
         .then((changes)=> {
             if(changes) {
                 res.status(200).json(changes)
             }
             else {
                 res.status(404).json({
                     message: "this user coulnd't be found"
                 })
             }
         })
         .catch((err)=> {
             console.log(err)
             res.status(500).json({
                 message: "error updating users shit"
             })
         })
   });
 

 
//NEED HELP ON THESE
//getid isn't working properly

router.get("api/posts/:id", (req,res)=> {
     const id = req.params;
     db.findById(id)

     .then((post)=> {
        if (post.length === 0) {
          res.status(404).json({
               message: "no post" 
            })
        }
        else {
           res.status(200).json(post)
        }
     })
     .catch(()=> {
         console.log(err)
         return res.status(500).json({
             message: "OH NO!!! FIRE!!"
         })
     })
})

router.post("/api/posts/:id/comments", (req, res)=> {

    const {id} = req.params;
    const {text} = req.body;
    const comment = {...req.body, post_id:id};

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
                else {
                    db.insertComment(comment)
                        .then((comment)=> {
                            db.findCommentById(comment.id)
                                .then(comment => {
                                    res.status(201).json({comment})
                                })
                        })
                        .catch((err)=> {
                            res.status(500).json({
                                message: "OH that didn't work.. sorry"
                            })
                        });
                }
            })
            .catch((error)=> {
                res.status(500).json(error)
            });
    }
});

router.delete("api/posts/:id", (req, res)=> {
    db.findById(req.params.id)
        .then((post)=> {
            if(post) {
                db.remove(req.params.id)
                    .then(()=> {
                        res.status(200).json({
                            message: "Post Destroyed FOREVER"
                        })
                    })
            }
            else {
                res.status(404).json({
                    message: "The post with this ID ain't there"
                })
            }
        })
        .catch((err)=> {
            console.log(err)
            res.status(500).json({
                message: "Errrrrooooorrrrr"
            })
        })
})



module.exports =router