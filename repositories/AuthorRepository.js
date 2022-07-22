const Author = require("../models/Author");

class AuthorRepository {
    // Increment Article Number
    async updateArticles(userid, increment) {
        try {
            await Author.findOneAndUpdate({
                user_id: userid
            },
                {
                    $inc: { articles: increment ? 1 : -1 }
                });
            return {
                success: true
            }

        } catch (err) {
            return {
                success: true
            }
        }

    }

    async updateReads(userid, increment) {
        try {
            await Author.findOneAndUpdate({
                user_id: userid
            },
                {
                    $inc: { reads: increment ? 1 : -1 }
                });
            return {
                success: true
            }

        } catch (err) {
            return {
                success: true
            }
        }

    }

    // Returns Authors 
    async findAuthors() {
        const result = await Author.find({
        });
        return result;
    }


}

module.exports = AuthorRepository;