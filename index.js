const express = require("express")
const postsRouter = require("./postsRouter")

const server = express()
const port = 8000

server.use(express.json())
server.use(postsRouter)

server.listen(port, ()=>{
    console.log(`server is running on at http://localhost:${port}`)
})