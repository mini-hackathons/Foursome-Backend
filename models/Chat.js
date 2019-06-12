const mongoose = require('mongoose');
const { MESSAGES_PER_PAGE } = require('../config/constants');

let MessageSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        body: String
    },
    {
        timestamps: true
    }
);

let PageSchema = new mongoose.Schema(
    {
        pageNumber: Number,
        messages: [ MessageSchema ]
    }
);
PageSchema.methods.isFull = function() {
    return this.messages.length >= MESSAGES_PER_PAGE;
}

let ChatSchema = new mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        ] ,
        pages: {
            type: [ PageSchema ],
            default: [ PageSchema ]
        }
    }
);
ChatSchema.statics.findOrCreate = async function(membersArr) {
    try {
        let chat = await this.findOne({ $and: [
            { members: { $all: membersArr } },
            { members: { $size: membersArr.length } }
        ]});

        if(chat.length === 0){
            chat = new this({
                members: membersArr
            });
            await chat.save();
        }

        return chat;
    }catch(err) {
        console.log(err);
        return err;
    }
}
ChatSchema.methods.saveMessage = async function(author, body) {
    try {
        const msg = { author, body };

        let curPage = this.pages[0];
        if(curPage.isFull()){
            const page = {
                pageNumber: this.pages.length,
                messages: []
            }
            this.pages.unshift(page);
            curPage = this.pages[0]
        }

        curPage.messages.unshift(msg);
        await this.save();
    }catch(err) {
        console.log(err)
    }
}
ChatSchema.methods.getPage = function(pageNumber) {
    const page = this.pages[pageNumber];
    const { messages } = page;
    return messages
}

module.exports = mongoose.model('Chat', ChatSchema);