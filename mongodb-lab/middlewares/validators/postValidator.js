const { body, param, query } = require('express-validator');

exports.createPostRules = [
 body('title')
 .trim()
 .notEmpty().withMessage('title is required')
 .bail()
 .isLength({ min: 3, max: 200 }).withMessage('title length must be 3-200'),
 body('content')
 .trim()
 .notEmpty().withMessage('content is required')
 .bail()
 .isLength({ min: 10 }).withMessage('content min length is 10'),
 body('author')
 .trim()
 .notEmpty().withMessage('author is required')
 .bail()
 .isLength({ min: 2, max: 100 }).withMessage('author length must be 2-100'),
 body('tags').optional().isArray().withMessage('tags must be an array'),
 body('tags.*').optional().isString().withMessage('each tag must be a string').trim()
];

exports.updatePostRules = [
 param('id').trim().isMongoId().withMessage('invalid post id'),
 body().custom((value) => {
 const allowedFields = ['title', 'content', 'tags'];
 const hasAllowedField = allowedFields.some((field) => Object.prototype.hasOwnProperty.call(value || {}, field));

 if (!hasAllowedField) {
 throw new Error('at least one of title, content or tags is required');
 }

 return true;
 }),
 body('title').optional().trim().notEmpty().withMessage('title must not be empty')
 .bail()
 .isLength({ min: 3, max: 200 }).withMessage('title length must be 3-200'),
 body('content').optional().trim().notEmpty().withMessage('content must not be empty')
 .bail()
 .isLength({ min: 10 }).withMessage('content min length is 10'),
 body('tags').optional().isArray().withMessage('tags must be an array'),
 body('tags.*').optional().isString().withMessage('each tag must be a string').trim()
];

exports.getPostsRules = [
 query('page').optional().toInt().isInt({ min: 1 }).withMessage('page must be >= 1'),
 query('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
 query('author').optional().trim().notEmpty().withMessage('author must not be empty'),
 query('tag').optional().trim().notEmpty().withMessage('tag must not be empty'),
 query('minLikes').optional().toInt().isInt({ min: 0 }).withMessage('minLikes must be >= 0'),
 query('q').optional().trim().isLength({ min: 2 }).withMessage('q min length is 2'),
 query('sortBy').optional().trim().isIn(['createdAt', 'updatedAt', 'likes', 'title', 'author', 'commentsCount'])
 .withMessage('invalid sortBy'),
 query('sortOrder').optional().trim().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc')
];

exports.searchPostsRules = [
 query('q').trim().notEmpty().withMessage('q is required')
 .isLength({ min: 2 }).withMessage('q min length is 2')
];

exports.mongoIdParamRule = [
 param('id').trim().isMongoId().withMessage('invalid id')
];
