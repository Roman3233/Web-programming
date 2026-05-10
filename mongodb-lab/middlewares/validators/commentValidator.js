const { body, param } = require('express-validator');

exports.createCommentRules = [
 body('postId')
 .trim()
 .notEmpty().withMessage('postId is required')
 .bail()
 .isMongoId().withMessage('invalid postId'),
 body('author')
 .trim()
 .notEmpty().withMessage('author is required')
 .bail()
 .isLength({ min: 2, max: 100 }).withMessage('author length must be 2-100'),
 body('content')
 .trim()
 .notEmpty().withMessage('content is required')
 .bail()
 .isLength({ min: 1, max: 1000 }).withMessage('content length must be 1-1000')
];

exports.updateCommentRules = [
 param('id').trim().isMongoId().withMessage('invalid comment id'),
 body('content')
 .trim()
 .notEmpty().withMessage('content is required')
 .bail()
 .isLength({ min: 1, max: 1000 }).withMessage('content length must be 1-1000')
];

exports.deleteCommentRules = [
 param('id').trim().isMongoId().withMessage('invalid comment id')
];

exports.postIdParamRules = [
 param('postId').trim().isMongoId().withMessage('invalid postId')
];
