const BaseJoi = require('joi');

module.exports.bookSchema = BaseJoi.object({
    book: BaseJoi.object({
        title: BaseJoi.string().required(),
        author: BaseJoi.string().required(),
        genre: BaseJoi.array().required(),
        rating: BaseJoi.number().min(1).max(5).required(),
        image: BaseJoi.string().uri(),
        bookLink: BaseJoi.string().uri(),
    }).required(),
});
