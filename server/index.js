const app = require("./src/routes/index.js");


app.get("/",(req,res)=>{
    res.send("API is running ...")
})
app.listen(3001,console.log(`Todo good, server running port 3001`))
