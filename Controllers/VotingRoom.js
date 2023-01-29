const { default: mongoose } = require("mongoose");
const Voter = require("../Models/Voter");
const VoterRoom = require("../Models/VotingRoom")

const createRoom = async (req, res) => {
    const { voters, chatId, title, rivals } = req.body;
    console.log(req.body);
    let c = rivals?.length

    if (!chatId || !title || !rivals) {
        return res.status(400).send({ "msg": "please enter correct details" })
    }

    let i = 0;
    while (i < rivals.length) {
        if (typeof (rivals[i].img) === "object") {
            rivals[i].img = ""
        } i++
    }

    try {
        const response = await VoterRoom.create(req.body)
        console.log(response);
        res.status(201).send({ response })
    } catch (error) {
        return res.status(500).send({ "msg": "something went wrong" })
    }
}








const getRoom = async (req, res) => {
    const { id } = req.params
    const newdate = new Date()



    try {
        const response = await VoterRoom.findOne({ _id: id })
        console.log(response);
        if(!response){
            return res.status(404).send({"msg":"room not found"})
        }
        console.log(response);
        let c = response.createdAt
        let g = response.createdAt.getHours()
        c.setHours(g + response.hours)
        if (newdate > c) {
            response.finished = true
            let i = 1;
            let winner = response.rivals[0];

            let winnerCount = response.rivals[0].count;
            while (i < response.rivals.length) {
                if (response.rivals[i].count > winnerCount) {
                    winner = response.rivals[i]
                    console.log(winner);
                }

                i++
            }


            await response.save()
            return res.status(202).send({ "msg": `voting has been finished, winner declared -->${winner.name}`, winner, title: response.title })
        }
        res.status(200).send(response)
    } catch (error) {
        console.log({ ...error});
        return res.status(500).send({ "msg": "something went wrong" })

    }
}

const getAllRooms = async (req, res) => {

    try {
        const response = await VoterRoom.find()
        res.status(200).send({ response })
    } catch (error) {
        return res.status(500).send({ "msg": "something went wrong" })

    }
}


const updateRoom = async (req, res) => {
    const { rivals, rivalGmail, voterGmail } = req.body;
    console.log(req.body);
    const { id } = req.params;
    const newDate = new Date().toISOString()

    try {

        const room = await VoterRoom.findOne({ _id: id })
        if (room.createdAt === newDate) {
            return res.status(200).send({ msg: "the Voting has finished please check out the winner" })

        }

        const voter = await Voter.findOne({ gmail: voterGmail, votingRoom: id })
        console.log(voter, "here it is");
        if (voter?.votingRoom.toString() === mongoose.Types.ObjectId(id).toString()) {
            console.log("🤣🤣🤣🤣🤣🤣");
            return res.status(400).send({ msg: "already casted your vote!.." })

        }
        else {
            //creating voter
            await Voter.create({ gmail: voterGmail, votingRoom: id, rivalGmail: rivalGmail });

        }



        let i = 0;
        while (i < room.rivals.length) {
            // console.log(rivals[i].email, rivalGmail);
            if (rivals[i].email === rivalGmail) {

                room.rivals[i].count += 1
                await room.save();
                // console.log(room);
                return res.status(200).send({ msg: "updated", room })
            }
            i++;
        }
        return res.status(200).send({ msg: "updated", room })

    } catch (error) {
        console.log(error);
        return res.status(400).send({ "msg": " something went wrong" })


    }
}


module.exports = {
    createRoom, getRoom, updateRoom, getAllRooms
}