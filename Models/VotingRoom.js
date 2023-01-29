const mongoose = require('mongoose')

const VotingRoomSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    chatId: {
        type: String,
        required: true,
        unique: true
    },

    rivals: [{

        name: {
            type: String,
            required: true,
        },
        email: {
            type: String
            , required: true,
        }, 
        img: {
            type: String
        },
        count: {
            type: Number,
            default: 0

        }

    }]
    ,
    hours: {
        type: Number,
        default: 1,

    }
    ,
    finished: {
        type: Boolean
        , default: false
    },


}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


module.exports = mongoose.model('VoterRoom', VotingRoomSchema)