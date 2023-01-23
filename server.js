var express = require("express")

var app = express()

var cors = require('cors')

let projectCollection;

let http = require('http').createServer(app);

let io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'))

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors())

//mongoDB connnection

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://s223008124:fate33rio@cluster0.9rplt6a.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {useNewUrlParser: true})


const createCollection = (collectionName) => {
    client.connect((err, db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDb Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}

//insert project

const insertProjefcts = (project, callback) => {
    projectCollection.insert(project, callback);
}

//post api

app.post('/api/projects', (req, res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjefcts(newProject, (err, result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})

// const cardList = [

//     {

//         title: "Kitten 2",

//         image: "images/image-outline-filled.png",

//         link: "About Kitten 2",

//         desciption: "Demo desciption about kitten 2"

//     },

//     {

//         title: "Kitten 3",

//         image: "images/image-outline-filled.png",

//         link: "About Kitten 3",

//         desciption: "Demo desciption about kitten 3"

//     }

// ]

//get project
const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}


app.get('/api/projects',(req,res) => {
    getProjects((err, result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })

})

http.listen(port,()=>{
    
    console.log("App listening to: http://localhost:"+port)
    createCollection('Pets')
    
})

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    setInterval(() => {
      socket.emit("number", parseInt(Math.random() * 10));
    }, 1000);
  });

var port = process.env.port || 3000;