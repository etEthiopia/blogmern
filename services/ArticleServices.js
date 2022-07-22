const ArticleRepository = require("../repositories/ArticleRepository");
const AuthorRepository = require("../repositories/AuthorRepository");

const articleRepo = new ArticleRepository();
const authorRepo = new AuthorRepository();



// Returns Public Articles
module.exports.findPublicArticlesService = async (all) => {
    return await articleRepo.findPublicArticles(all);
};

// Returns Latest Articles
module.exports.findLatestArticlesService = async (page) => {
    return await articleRepo.findLatestArticles(page);

}

// Returns Trending Articles
module.exports.findTrendingArticlesService = async (page, limit) => {
    return await articleRepo.findTrendingArticles(page, limit);
};

// Returns Articles In A Category
module.exports.findArticlesInCategoryService = async (category, page) => {
    return await articleRepo.findArticlesInCategory(category, page);
};

// Returns Articles By Author
module.exports.findArticlesByAuthorService = async (userid, page, filters) => {


    return await articleRepo.findArticlesByAuthor(page, filters ?
        {
            author_user_id: userid,
            is_visible: true,
            is_approved: true,
            is_draft: false
        }
        : { author_user_id: userid }
    );
}

// Creates A New Article
module.exports.addArticleService = async (article, userid) => {
    const result = await articleRepo.addArticle(article, userid);
    if (result.success) {
        await authorRepo.updateArticles(userid, true)
    }
    return result;
}

// Returns Article By Slug
module.exports.findArticleBySlugService = async (slug, userid = "") => {
    return await articleRepo.findArticleBySlug(slug, userid);
}

// Updates Article
module.exports.updateArticleService = async (id, article, incremenet) => {

    const result = await articleRepo.updateArticle(id, article);

    if (result.success && incremenet !== null) {
        await authorRepo.updateArticles(result.value.author_user_id, incremenet)
    }
    return result;
}

// Deletes Article
module.exports.deleteArticleService = async (id) => {

    const result = await articleRepo.deleteArticle(id);
    if (result.success) {
        await authorRepo.updateArticles(result.value.author_user_id, false)
    }
    return result;
}

module.exports.readArticleService = async (id, authoruserid) => {
    const notFound = {
        success: false,
        message: 'Not Found'
    };


    const current_article = await articleRepo.findArticleById(id);

    if (current_article === null) {
        return notFound;
    }
    if (current_article.author_user_id !== authoruserid) {
        return notFound;
    }
    // return true;
    await authorRepo.updateReads(authoruserid, true);

    const c_previous_read_on = current_article.previous_read_on;
    const c_date = Date.now();
    //Days 1000 * 3600
    const pureTimeDiff = (c_date - c_previous_read_on) / 1000;
    const diffDays = (pureTimeDiff / 60) % 60;
    if (diffDays > 1) {

        const result = await articleRepo.readArticle(
            id,
            {
                current_read: 1,
                trending: (1000 * current_article.current_read) / (c_date - current_article.current_read_on),
                previous_read_on: current_article.current_read_on,
                current_read_on: c_date,
                $inc: { reads: 1 },
            });
        if (result.success) {
            return {
                success: true
            }
        } else {

            return notFound;
        }


    }
    else {
        const result = articleRepo.readArticle(
            id,
            {
                current_read_on: c_date,
                trending: pureTimeDiff === 0 ? 0 : (current_article.current_read + 1) / pureTimeDiff,
                $inc: { reads: 1, current_read: 1 },
            });
        if (result.success) {
            return {
                success: true
            }
        } else {

            return notFound;
        }

    }

}