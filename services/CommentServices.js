const AuthorRepository = require("../repositories/AuthorRepository");
const CommentRepository = require("../repositories/CommentRepository")

const commentRepo = new CommentRepository();
const authorRepo = new AuthorRepository();

// Returns Article Comments
module.exports.findCommentsOfArticle = async (article_id, search_text) => {
    const comments = await commentRepo.findArticleComments(article_id, search_text);
    //console.log(comments);
    if (comments !== null) {
        if (comments.length > 0) {
            const authors = await authorRepo.findAuthors();
            const authorsMap = new Map(
                authors.map(author => {
                    return [author.user_id, { full_name: author.full_name, profile_pic: author.profile_pic }]
                })
            );
            const commentsWithAuthors = [];
            comments.forEach((comment) => {

                // console.log(authorsMap.get(comment.author_user_id))
                // console.log(comment);
                const authorDataForComment = authorsMap.get(comment.author_user_id);
                if (authorDataForComment !== undefined) {
                    const fullCommentData = {
                        body: comment.body,
                        author_user_id: comment.author_user_id,
                        timestamp: comment.createdAt,
                        author_full_name: authorDataForComment.full_name,
                        author_profile_pic: authorDataForComment.profile_pic
                    }
                    commentsWithAuthors.push(fullCommentData)
                }

            })
            return commentsWithAuthors;

        }
    }
    return [];
}

// Creates A New Comment
module.exports.addCommentService = async (comment) => {
    return await commentRepo.addComment(comment);
}