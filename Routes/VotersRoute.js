const express= require("express");
const router = express.Router()
const { CreateVoter, getAllVoters } = require("../Controllers/Voter");

router.post("/",CreateVoter)
router.get("/:id",getAllVoters)


module.exports=router