const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const buildPostsMatchStage = (query) => {
 const matchStage = {};

 if (query.author) {
 matchStage.author = query.author;
 }

 if (query.tag) {
 matchStage.tags = query.tag;
 }

 if (query.minLikes) {
 const minLikes = Number(query.minLikes);
 if (!Number.isNaN(minLikes)) {
 matchStage.likes = { $gte: minLikes };
 }
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

// ==================== CREATE ====================
// Створення нового поста
exports.createPost = async (req, res) => {
 try {
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
 } catch (error) {
 res.status(400).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== READ ====================
// Отримання всіх постів з пагінацією, фільтрацією та сортуванням
exports.getAllPosts = async (req, res) => {
 try {
 const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
 const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
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
 minLikes: req.query.minLikes || null,
 q: req.query.q || null
 },
 sorting: {
 sortBy: Object.keys(sortStage)[0],
 sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc'
 },
 data: posts
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// Отримання одного поста з коментарями
exports.getPostById = async (req, res) => {
 try {
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
 return res.status(400).json({
 success: false,
 message: 'Некоректний ID поста'
 });
 }

 const [post] = await Post.aggregate(
 buildPostsAggregationPipeline({
 matchStage: { _id: new mongoose.Types.ObjectId(req.params.id) },
 sortStage: { _id: -1 }
 })
 );

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 const comments = await Comment.find({ post: post._id })
 .sort({ createdAt: -1 });

 res.status(200).json({
 success: true,
 data: {
 post,
 comments
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// Пошук постів
exports.searchPosts = async (req, res) => {
 try {
 const { q } = req.query;

 if (!q) {
 return res.status(400).json({
 success: false,
 message: 'Пошуковий запит q є обов’язковим'
 });
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
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== UPDATE ====================
// Оновлення поста
exports.updatePost = async (req, res) => {
 try {
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
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Пост успішно оновлено'
 });
 } catch (error) {
 res.status(400).json({
 success: false,
 message: error.message
 });
 }
};

// Збільшення лічильника лайків
exports.likePost = async (req, res) => {
 try {
 const post = await Post.findByIdAndUpdate(
 req.params.id,
 { $inc: { likes: 1 } },
 { new: true }
 );

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Лайк додано'
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== DELETE ====================
// Видалення поста та всіх його коментарів
exports.deletePost = async (req, res) => {
 try {
 const post = await Post.findById(req.params.id);

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 await Comment.deleteMany({ post: post._id });
 await post.deleteOne();

 res.status(200).json({
 success: true,
 message: 'Пост та всі коментарі видалено'
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};
