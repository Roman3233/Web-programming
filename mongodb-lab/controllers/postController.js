const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const buildPostsMatchStage = (query) => {
 const matchStage = {};

 if (query.author) {
 matchStage.author = query.author;
 }

 if (query.tag) {
 matchStage.tags = query.tag;
 }

 if (query.minLikes !== undefined) {
 matchStage.likes = { $gte: query.minLikes };
 }

 if (query.q) {
 matchStage.$or = [
 { title: { $regex: query.q, $options: 'i' } },
 { content: { $regex: query.q, $options: 'i' } }
 ];
 }

 return matchStage;
};

const buildPostsSortStage = (sortBy, sortOrder) => {
 const allowedSortFields = ['createdAt', 'updatedAt', 'likes', 'title', 'author', 'commentsCount'];
 const normalizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
 const normalizedSortOrder = sortOrder === 'asc' ? 1 : -1;

 return {
 [normalizedSortBy]: normalizedSortOrder,
 _id: -1
 };
};

const buildPostsAggregationPipeline = ({ matchStage, sortStage, skip = 0, limit }) => {
 const pipeline = [
 { $match: matchStage },
 {
 $lookup: {
 from: 'comments',
 localField: '_id',
 foreignField: 'post',
 as: 'comments'
 }
 },
 {
 $addFields: {
 commentsCount: { $size: '$comments' }
 }
 },
 {
 $project: {
 comments: 0
 }
 },
 { $sort: sortStage },
 { $skip: skip }
 ];

 if (typeof limit === 'number') {
 pipeline.push({ $limit: limit });
 }

 return pipeline;
};

exports.createPost = asyncHandler(async (req, res) => {
 const { title, content, author, tags } = req.body;

 const post = await Post.create({
 title,
 content,
 author,
 tags: tags || []
 });

 res.status(201).json({
 success: true,
 data: post,
 message: 'Пост успішно створено'
 });
});

exports.getAllPosts = asyncHandler(async (req, res) => {
 const page = Math.max(req.query.page || 1, 1);
 const limit = Math.max(req.query.limit || 10, 1);
 const skip = (page - 1) * limit;
 const matchStage = buildPostsMatchStage(req.query);
 const sortStage = buildPostsSortStage(req.query.sortBy, req.query.sortOrder);

 const [posts, totalResult] = await Promise.all([
 Post.aggregate(buildPostsAggregationPipeline({ matchStage, sortStage, skip, limit })),
 Post.aggregate([
 { $match: matchStage },
 { $count: 'total' }
 ])
 ]);

 const total = totalResult[0]?.total || 0;

 res.status(200).json({
 success: true,
 count: posts.length,
 total,
 totalPages: Math.ceil(total / limit),
 currentPage: page,
 filters: {
 author: req.query.author || null,
 tag: req.query.tag || null,
 minLikes: req.query.minLikes ?? null,
 q: req.query.q || null
 },
 sorting: {
 sortBy: Object.keys(sortStage)[0],
 sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc'
 },
 data: posts
 });
});

exports.getPostById = asyncHandler(async (req, res) => {
 const post = await Post.findById(req.params.id);

 if (!post) {
 throw ApiError.notFound('Пост не знайдено');
 }

 const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });

 res.status(200).json({
 success: true,
 data: { post, comments }
 });
});

exports.searchPosts = asyncHandler(async (req, res) => {
 const { q } = req.query;

 if (!q) {
 throw ApiError.badRequest('Validation error', [
 { field: 'q', msg: 'q: is required' }
 ]);
 }

 const posts = await Post.aggregate([
 {
 $match: { $text: { $search: q } }
 },
 {
 $addFields: {
 score: { $meta: 'textScore' }
 }
 },
 {
 $lookup: {
 from: 'comments',
 localField: '_id',
 foreignField: 'post',
 as: 'comments'
 }
 },
 {
 $addFields: {
 commentsCount: { $size: '$comments' }
 }
 },
 {
 $project: {
 comments: 0
 }
 },
 { $sort: { score: -1, _id: -1 } }
 ]);

 res.status(200).json({
 success: true,
 count: posts.length,
 data: posts
 });
});

exports.updatePost = asyncHandler(async (req, res) => {
 const { title, content, tags } = req.body;

 const post = await Post.findByIdAndUpdate(
 req.params.id,
 {
 title,
 content,
 tags,
 updatedAt: Date.now()
 },
 {
 new: true,
 runValidators: true
 }
 );

 if (!post) {
 throw ApiError.notFound('Пост не знайдено');
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Пост успішно оновлено'
 });
});

exports.likePost = asyncHandler(async (req, res) => {
 const post = await Post.findByIdAndUpdate(
 req.params.id,
 { $inc: { likes: 1 } },
 { new: true }
 );

 if (!post) {
 throw ApiError.notFound('Пост не знайдено');
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Лайк додано'
 });
});

exports.deletePost = asyncHandler(async (req, res) => {
 const post = await Post.findById(req.params.id);

 if (!post) {
 throw ApiError.notFound('Пост не знайдено');
 }

 await Comment.deleteMany({ post: post._id });
 await post.deleteOne();

 res.status(200).json({
 success: true,
 message: 'Пост та всі коментарі видалено'
 });
});
