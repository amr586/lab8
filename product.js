const Product = require("../models/product");

//____________________ createProduct

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json("product created");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//____________________ geAllProducts
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "the all products", products });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//____________________ getproductById
const getproductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product found", product });
  } catch (err) {
    res.status(500).json(err);
  }
};

//____________________ updateproduct
const updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedproduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedproduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({
      message: "product updated successfully",
      product: updatedproduct,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

//____________________ deleteProduct
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getproductById,
  updateproduct,
  deleteProduct,
};
