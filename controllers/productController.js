import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
//adding product
const addProducts = async (req, res) => {
  try {
    // Debug logs to inspect incoming data
    console.log("Incoming Body:", req.body);
    console.log("Incoming Files:", req.files);

    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Access uploaded image files (from multer)
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    // Upload each image to Cloudinary and collect URLs
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    // Safe parsing of sizes string (handle JSON, empty strings, etc.)
    let parsedSizes = [];
    if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    } else if (typeof sizes === 'string' && sizes.trim() !== '') {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (err) {
        console.error("Error parsing sizes JSON:", err.message);
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format. Expecting JSON array string.",
        });
      }
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();

    res.json({
      success: true,
      message: 'Your product has been added successfully!',
      product: savedProduct,
    });

  } catch (error) {
    console.error('Error in addProducts:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message,
        });
    }
};
// remove product
const removeProducts = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error removing product:", error.message);
        res.json({
            success: false,
            message: 'Failed to remove product',
            error: error.message,
        });
    }
};
// single product info
const singleProducts = async (req, res) => {
    try {
        const { productID } = req.body;
        const product = await productModel.findById(productID);
        res.json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message,
        });
    }
};

export default { addProducts, listProducts, removeProducts, singleProducts };
