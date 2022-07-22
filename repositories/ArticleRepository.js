const Article = require("../models/Article");

class ArticleRepository {
    // Returns Public or All Articles
    async findPublicArticles(all = false) {

        const result = await Article.find(
            all ? {} :
                {
                    is_visible: true,
                    is_approved: true,
                    is_draft: false
                })
            .sort({
                title: 1
            })
        return result;
    }

    // Returns Latest Public Articles
    async findLatestArticles(page) {
        const result = await Article.paginate({
            is_visible: true,
            is_approved: true,
            is_draft: false
        }, { page: page, limit: 9, sort: { createdAt: -1 } })
        return result;
    }

    // Returns Latest Public Articles
    async findTrendingArticles(page, limit) {
        const result = await Article.paginate({
            is_visible: true,
            is_approved: true,
            is_draft: false
        }, { page: page, limit: limit, sort: { trending: -1 } })
        return result;
    }

    // Returns Articles In A Category
    async findArticlesInCategory(category, page) {
        const result = await Article.paginate({
            category: category,
            is_visible: true,
            is_approved: true,
            is_draft: false
        }, { page: page, limit: 9, sort: { reads: 1 } })
        return result;
    }


    // Returns Articles By An Author
    async findArticlesByAuthor(filter, page) {
        const result = await Article.paginate({ filter }, { page: page, limit: 9, sort: { createdAt: -1 } })
        return result;
    }

    // Creates A New Article
    async addArticle(article, userid) {
        const { title, category, content, author_full_name, slug, thumbnail, is_draft } = article;
        const newArticle = new Article({
            title: title,
            category: category,
            content: content,
            author_user_id: userid,
            author_full_name: author_full_name,
            thumbnail: thumbnail,
            slug: slug,
            is_draft: is_draft
        });
        try {
            const addedArticle = await newArticle
                .save();
            if (addedArticle !== null) {
                return {
                    success: true, value: addedArticle
                }
            }
            else {
                return {
                    message: "Error",
                    success: false
                }
            }
        }
        catch (err) {
            if (err.code === 11000) {
                return {
                    message: "Duplicate Category",
                    success: false
                };

            } else {
                return {
                    message: err,
                    success: false
                };
            }
        }
    }

    // Returns Article By Slug
    async findArticleBySlug(slug, userid = "") {
        let result;
        if (userid !== "") {
            result = await Article.findOne({
                author_user_id: userid,
                slug: slug
            })
        } else {
            result = await Article.findOne({
                is_visible: true,
                is_approved: true,
                is_draft: false,
                slug: slug
            })
        }
        return result;
    }

    // Updates Article
    async updateArticle(id, article) {
        try {
            const checkingArticle = await Article.findByIdAndUpdate(
                id, article, { new: false }
            );
            if (checkingArticle !== null) {
                return {
                    success: true, value: checkingArticle
                }
            }
            else {
                return {
                    message: "Error",
                    success: false
                }
            }
        }
        catch (err) {
            return {
                message: err,
                success: false
            };
        }
    }

    // Deletes Article
    async deleteArticle(id) {
        try {
            const checkingArticle = await Article.findByIdAndDelete(
                id
            );
            if (checkingArticle !== null) {
                return {
                    success: true, value: checkingArticle
                }
            }
            else {
                return {
                    message: "Error",
                    success: false
                }
            }
        }
        catch (err) {
            return {
                message: err,
                success: false
            };
        }
    }

    // Returns Article By Slug
    async findArticleById(id) {
        const result = await Article.findById(id)
        return result;
    }

    // Reads Article
    async readArticle(id, update) {
        try {
            const checkingArticle = await Article.findOneAndUpdate(
                {
                    _id: id,
                    is_visible: true,
                    is_approved: true,
                    is_draft: false
                }, update, { new: false }
            );
            if (checkingArticle !== null) {
                return {
                    success: true, value: checkingArticle
                }
            }
            else {
                return {
                    message: "Error",
                    success: false
                }
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

module.exports = ArticleRepository;