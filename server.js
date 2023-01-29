require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()
const Connect = require("./Db/Connect")
const VoterRoute = require("./Routes/VotersRoute")
const VoterRoomRoute = require("./Routes/VotingRoomRoute")
const ErrorHandler = require("./Middleware/ErrorHandler")
const NotFound = require("./Middleware/NotFound")
const Credentials = require("./Middleware/Credentials")
const CorsOptions = require("./Config/CorsOptions")

app.use(express.urlencoded({ extended: false }))

app.use(Credentials)

//cross origin resource sharing
app.use(cors(CorsOptions))

app.use(express.urlencoded({ extended: false }))

//middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())
const port = process.env.PORT || 8080;

app.use('/welcome', (req, res) => {
    console.log("fsdfs");
    res.json({ "msg": "welcome to web app" })
})

app.use('/api/voters', VoterRoute)
app.use('/api/voterroom', VoterRoomRoute)

app.use(ErrorHandler)

app.use(NotFound)
const Start = async () => {

    try {

        app.listen(port, console.log(`server is listening on ${port}..`))
        await Connect(process.env.MONGO_URI).then(() => console.log("connected to db~..."))
    } catch (error) {
        console.log(error);
    }
}



Start();
