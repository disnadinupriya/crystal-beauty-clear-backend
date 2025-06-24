import express from 'express';
import productModel from '../models/product.js'; 


export async function CreateProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "you need to login first" });
        return;
    }
    if (req.user.rol !== 'admin') {
        res.status(403).json({ message: "Yo u  are not authorized to create a product" });
        return;
    }

    const newProduct = new productModel(req.body);

  /*  newProduct.save().then(() => {
        res.json({
            message: "Product created successfully",
            product: newProduct
        });
    })
        .catch((err) => {
            console.error('Error creating product:', err);
            res.status(500).json({ message: "Error creating product", error: err.message });
        });
        */
       try {
        await newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: "Error creating product", error: err.message });
    }
}


export function getProduct(req, res) {
    productModel.find().then((products) => {
        res.json(products);
    })
        .catch((err) => {
            console.error('Error fetching products:', err);
            res.status(500).json({ message: "Error fetching products", error: err.message });
        });
}



export function deleteProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "you need to login first" });
        return;
    }
    if (req.user.rol !== 'admin') {
        res.status(403).json({ message: "You are not authorized to delete a product" });
        return;
    }
    productModel.findOneAndDelete(req.params.id).then(
        () => {
            res.json({
                message: "Product deleted successfully"
            });
        }
    ).catch((err) => {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: "Error deleting product", error: err.message });
    });
}

export function updateProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "you need to login first" });
        return;
    }
    if (req.user.rol !== 'admin') {
        res.status(403).json({ message: "You are not authorized to update a product" });
        return;
    }

    productModel.findOneAndUpdate({
        productid: req.params.id
    }, req.body, { new: true }).then((updatedProduct) => {
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json({ message: "Product updated successfully", product: updatedProduct });
    })
        .catch((err) => {
            console.error('Error updating product:', err);
            res.status(500).json({ message: "Error updating product", error: err.message });
        });
}
