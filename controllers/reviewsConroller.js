import mongoose from "mongoose";
import * as ReviewModule from "../models/reviews.js";

const Review = ReviewModule.default || ReviewModule.Review || ReviewModule.ReviewSchema || ReviewModule;

export async function getReviews(req, res) {
    try {
        const filter = {};
        if (req.query.product) filter.product = req.query.product;

        const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Failed to load reviews", error: err.message });
    }
}

export async function getReviewById(req, res) {
    try {
        const { id } = req.params;
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid review id" });
        }

        const review = await Review.findById(id).lean();
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json(review);
    } catch (err) {
        console.error("Error fetching review by id:", err);
        res.status(500).json({ message: "Failed to load review", error: err.message });
    }
}

export async function createReview(req, res) {
    try {
        const { name, product, rating, comment } = req.body;

        if (!product || typeof product !== "string") {
            return res.status(400).json({ message: "Product is required" });
        }
        if (rating == null || isNaN(Number(rating))) {
            return res.status(400).json({ message: "Rating is required and must be a number" });
        }
        const numRating = Number(rating);
        if (numRating < 0 || numRating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }
        if (!comment || typeof comment !== "string") {
            return res.status(400).json({ message: "Comment is required" });
        }

        const payload = {
            name: name ? String(name).trim() : "Anonymous",
            product: String(product),
            rating: numRating,
            comment: String(comment).trim(),
            createdAt: new Date(),
        };

        const created = await Review.create(payload);
        res.status(201).json(created);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).json({ message: "Failed to create review", error: err.message });
    }
}

export async function updateReview(req, res) {
    try {
        const { id } = req.params;
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid review id" });
        }

        const updates = {};
        if (req.body.rating != null) {
            const num = Number(req.body.rating);
            if (isNaN(num) || num < 0 || num > 5) {
                return res.status(400).json({ message: "Rating must be a number between 0 and 5" });
            }
            updates.rating = num;
        }
        if (req.body.comment != null) updates.comment = String(req.body.comment);
        if (req.body.product != null) updates.product = String(req.body.product);
        if (req.body.name != null) updates.name = String(req.body.name);
        updates.updatedAt = new Date();

        const updated = await Review.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ message: "Failed to update review", error: err.message });
    }
}

export async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid review id" });
        }

        const deleted = await Review.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Deleted", id: deleted._id });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ message: "Failed to delete review", error: err.message });
    }
}
