const Comment = require("../models/Comment");

class CommentRepository {

    // Returns Articles In A Category
    async findArticleComments(article_id, search_text) {
        var result = [];
        if (search_text === "-") {
            result = await Comment.find({
                article_id: article_id,
            }
            ).sort({ createdAt: -1 })
        } else {
            result = await Comment.find({
                article_id: article_id,
                body: { $regex: search_text }
            })
        }
        return result;
    }

    // Creates A New Category
    async addComment(comment) {
        const newComment = new Comment(comment);
        try {
            const addedComment = await newComment
                .save();
            return {
                success: true, value: addedComment
            }
        }
        catch (err) {
            return {
                message: err,
                success: false
            };
        }
    }


}

module.exports = CommentRepository;