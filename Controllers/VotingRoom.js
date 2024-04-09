const { default: mongoose } = require("mongoose");
const Voter = require("../Models/Voter");
const VoterRoom = require("../Models/VotingRoom");

const createRoom = async (req, res) => {
  const { voters, chatId, title, rivals } = req.body;
  let c = rivals?.length;

  if (!chatId || !title || !rivals) {
    return res.status(400).send({ msg: "please enter correct details" });
  }

  let i = 0;
  while (i < rivals.length) {
    if (typeof rivals[i].img === "object") {
      rivals[i].img = "";
    }
    i++;
  }

  try {
    const response = await VoterRoom.create(req.body);
    res.status(201).send({ response });
  } catch (error) {
    return res.status(500).send({ msg: "something went wrong" });
  }
};

const getRoom = async (req, res) => {
    const { id } = req.params;
    const newdate = new Date();
  
    try {
      const response = await VoterRoom.findOne({ _id: id });
      console.log(response);
      if (!response) {
        return res.status(404).send({ msg: "room not found" });
      }
      console.log(response);
      let c = response.createdAt;
      let g = response.createdAt.getHours();
      c.setHours(g + response.hours);
      if (newdate > c) {
        response.finished = true;
        let winners = [response.rivals[0]]; // Initialize winners array with the first participant
  
        let winnerCount = response.rivals[0].count;
        for (let i = 1; i < response.rivals.length; i++) {
          if (response.rivals[i].count > winnerCount) {
            winners = [response.rivals[i]]; // If a new winner is found, reset the winners array
            winnerCount = response.rivals[i].count;
          } else if (response.rivals[i].count === winnerCount) {
            winners.push(response.rivals[i]); // Add participants with equal votes to the winners array
          }
        }
  
        response.winner = winners; // Update response with the winners array
  
        await response.save();
        return res.status(202).send({
          msg: `voting has been finished, winners declared --> ${winners.map((w) => w.name).join(", ")}`,
          winner:winners,
          ...response?._doc,
          title: response.title,
        });
      }
      res.status(200).send(response);
    } catch (error) {
      console.log({ ...error });
      return res.status(500).send({ msg: "something went wrong" });
    }
  };
  

const getAllRooms = async (req, res) => {
  try {
    const response = await VoterRoom.find();
    res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ msg: "something went wrong" });
  }
};

const updateRoom = async (req, res) => {
  const { rivals, rivalGmail, voterGmail } = req.body;
  const { id } = req.params;
  const newDate = new Date().toISOString();

  try {
    const room = await VoterRoom.findOne({ _id: id });
    if (room.createdAt === newDate) {
      return res
        .status(200)
        .send({ msg: "the Voting has finished please check out the winner" });
    }

    const voter = await Voter.findOne({ gmail: voterGmail, votingRoom: id });
    console.log(voter, "here it is");
    if (
      voter?.votingRoom.toString() === mongoose.Types.ObjectId(id).toString()
    ) {
      return res.status(400).send({ msg: "already casted your vote!.." });
    } else {
      //creating voter
      await Voter.create({
        gmail: voterGmail,
        votingRoom: id,
        rivalGmail: rivalGmail,
      });
    }

    let i = 0;
    while (i < room.rivals.length) {
      // console.log(rivals[i].email, rivalGmail);
      if (rivals[i].email === rivalGmail) {
        room.rivals[i].count += 1;
        await room.save();
        // console.log(room);
        return res.status(200).send({ msg: "updated", room });
      }
      i++;
    }
    return res.status(200).send({ msg: "updated", room });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: " something went wrong" });
  }
};

module.exports = {
  createRoom,
  getRoom,
  updateRoom,
  getAllRooms,
};
