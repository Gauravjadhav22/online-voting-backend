const Voter = require("../Models/Voter")

const CreateVoter = async (req, res) => {
    const { gmail, votingRoom } = req.body;
    try {
        Voter.create({ gmail, votingRoom });
        res.status(201).json({ "msg": "Voter has created..." })
    } catch (error) {
        return res.status(400).json({"msg":"you already voted,or something went wrong"})
    }

}

const getAllVoters = async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const voters = await Voter.find({ votingRoom: id })
        console.log(voters);
        res.status(200).json(voters)
    } catch (error) {
        console.log(error);
        return res.status(500).json({"msg":"something went wrong"})

    }

}




module.exports = {
    CreateVoter, getAllVoters
}