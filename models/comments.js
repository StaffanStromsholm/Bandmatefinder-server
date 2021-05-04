import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {type: Date, default: Date.now}
});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;