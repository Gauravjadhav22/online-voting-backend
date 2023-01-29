const mongoose = require('mongoose')

const VoterSchema = new mongoose.Schema({

    gmail: {
        type: String,
        required: true,

    },
    rivalGmail: {
        type: String,
        required: true,
    },
    votingRoom: {
        type: mongoose.Types.ObjectId,
        ref: 'Voters',
        required: true,
        
    },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = mongoose.model('Voter', VoterSchema)