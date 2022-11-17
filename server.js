var express = require("express")​

var app = express()​

var port = process.env.port || 3000;​

app.use(express.static(__dirname + '/pubilc'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))


app.listen(port,()=>{​

    console.log("App listening to: http://localhost:"+port)​

})