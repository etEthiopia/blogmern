const AuthorRepository = require("../repositories/AuthorRepository");

const authorRepo = new AuthorRepository();

// Creates A New Article
module.exports.updateAuthorArticlesService = async (userid, increment) => {
    return await authorRepo.updateArticles(userid, increment);
}

