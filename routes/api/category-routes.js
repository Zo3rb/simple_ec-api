const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // find all categories
    // be sure to include its associated Products
    const categories = await Category.findAll({
      include: [Product]
    });

    // Response
    res.json(categories);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // find one category by its `id` value
    // be sure to include its associated Products
    const data = await Category.findOne({
      where: { id: req.params.id },
      include: [Product]
    });

    // If Not Indexed ID
    if (!data) return res.status(404).json("Category Was Not Found with This ID");

    // If Catch Data
    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    // create a new category
    const { category_name } = req.body; // Get Inputs

    // Simple validation
    if (!category_name) return res.status(400).json("Invalid Category Name!, Please Try Again");

    // Provided Valid Data ?
    const newCat = await Category.create({ category_name });

    // Response
    res.status(201).json(newCat);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a category by its `id` value
    const { category_name } = req.body; // Get Inputs

    // Validate Inputs
    if (!category_name || category_name === "") return res.status(400).json("Invalid Category Name!, Please Try Again");

    // Provided Valid Data ?
    const data = await Category.update({ category_name }, { where: { id: req.params.id } });

    // Couldn't Find the Requested Document ? return array of [0] for failing or [1] for success
    if (!data[0]) return res.status(404).json("Category Was Not Found with This ID");

    // Response
    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete a category by its `id` value
    const { id } = req.params; // Getting Inputs

    // Delete and Get FeedBack
    const catToDelete = await Category.destroy({
      where: { id }
    });

    // Couldn't Find the Requested Document ?
    if (!catToDelete) return res.status(404).json("Category Was Not Found with This ID");

    // Response
    res.json(catToDelete);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
