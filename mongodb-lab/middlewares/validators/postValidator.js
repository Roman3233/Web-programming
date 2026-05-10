const { body, param, query } = require('express-validator');

const allowedSortFields = ['createdAt', 'updatedAt', 'likes', 'title', 'author', 'commentsCount'];
const allowedSortOrders = ['asc', 'desc'];

exports.createPostRules = [
 body('title')
 .trim()
 .notEmpty().withMessage('title: is required')
 .bail()
 .isLength({ min: 3, max: 200 }).withMessage('title: length must be 3-200 characters'),
 body('content')
 .trim()
 .notEmpty().withMessage('content: is required')
 .bail()
 .isLength({ min: 10 }).withMessage('content: length must be at least 10 characters'),
 body('author')
 .trim()
 .notEmpty().withMessage('author: is required')
 .bail()
 .isLength({ min: 2, max: 100 }).withMessage('author: length must be 2-100 characters'),
 body('tags')
 .optional()
 .isArray({ max: 10 }).withMessage('tags: must be an array with at most 10 items'),
 body('tags.*')
 .optional()
 .trim()
 .notEmpty().withMessage('tags: each tag is required')
 .bail()
 .isString().withMessage('tags: each tag must be a string')
];

exports.updatePostRules = [
 param('id').trim().isMongoId().withMessage('id: must be a valid MongoDB ObjectId'),
 body().custom((value) => {
 const allowedFields = ['title', 'content', 'tags'];
 const hasAllowedField = allowedFields.some((field) => Object.prototype.hasOwnProperty.call(value || {}, field));

 if (!hasAllowedField) {
 throw new Error('body: at least one of title, content or tags is required');
 }

 return true;
 }),
 body('title').optional().trim().notEmpty().withMessage('title: is required')
 .bail()
 .isLength({ min: 3, max: 200 }).withMessage('title: length must be 3-200 characters'),
 body('content').optional().trim().notEmpty().withMessage('content: is required')
 .bail()
 .isLength({ min: 10 }).withMessage('content: length must be at least 10 characters'),
 body('tags')
 .optional()
 .isArray({ max: 10 }).withMessage('tags: must be an array with at most 10 items'),
 body('tags.*')
 .optional()
 .trim()
 .notEmpty().withMessage('tags: each tag is required')
 .bail()
 .isString().withMessage('tags: each tag must be a string')
];

exports.getPostsRules = [
 query('page').optional().toInt().isInt({ min: 1 }).withMessage('page: must be an integer greater than or equal to 1'),
 query('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit: must be an integer from 1 to 100'),
 query('author').optional().trim().notEmpty().withMessage('author: must not be empty'),
 query('tag').optional().trim().notEmpty().withMessage('tag: must not be empty'),
 query('minLikes').optional().toInt().isInt({ min: 0 }).withMessage('minLikes: must be an integer greater than or equal to 0'),
 query('q').optional().trim().isLength({ min: 2 }).withMessage('q: length must be at least 2 characters'),
 query('sortBy').optional().trim().isIn(allowedSortFields)
 .withMessage(`sortBy: must be one of ${allowedSortFields.join(', ')}`),
 query('sortOrder').optional().trim().isIn(allowedSortOrders).withMessage(`sortOrder: must be one of ${allowedSortOrders.join(', ')}`)
];

exports.searchPostsRules = [
 query('q').trim().notEmpty().withMessage('q: is required')
 .bail()
 .isLength({ min: 2 }).withMessage('q: length must be at least 2 characters')
];

exports.mongoIdParamRule = [
 param('id').trim().isMongoId().withMessage('id: must be a valid MongoDB ObjectId')
];
