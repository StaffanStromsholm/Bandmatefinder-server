import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import User from '../models/user.js';
import Comment from '../models/comments.js';


export const createComment = async (req, res) => {
    const { id } = req.params;
    const { comment, authorId, authorUsername } = req.body;

    console.log('Receiver id: ' + id,  'Comment: ' + comment, 'by: ' + authorId);

    User.findById(id, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            Comment.create(comment, function (err, comment) {
                if (err) {
                    res.status(400).json('Error: ' + err.message);
                } else {
                    //add username and id to comment
                    comment.author.id = authorId;
                    comment.author.username = authorUsername;
                    //save comment
                    comment.save();

                    user.comments.push(comment);
                    user.save();
                    res.status(200).json('Created new comment')
                }
            })
        }
    })
}

export default router;