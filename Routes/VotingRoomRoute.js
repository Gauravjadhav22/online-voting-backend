const express= require("express");
const router = express.Router()

const { createRoom, getRoom, updateRoom ,getAllRooms} = require("../Controllers/VotingRoom");

router.route("/").get(getAllRooms).post(createRoom)
router.route("/:id").get(getRoom)
router.route("/update/:id").patch(updateRoom)

module.exports=router;