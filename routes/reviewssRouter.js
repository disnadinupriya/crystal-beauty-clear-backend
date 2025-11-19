import express from 'express';
import {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
} from '../controllers/reviewsConroller.js';

const reviewRouter = express.Router();

reviewRouter.get('/', getReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.post('/', createReview);
reviewRouter.put('/:id', updateReview);
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;
