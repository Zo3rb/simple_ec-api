const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // find all tags
    // be sure to include its associated Product data
    const tags = await Tag.findAll({ include: [Product] });
    res.json(tags);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // find a single tag by its `id`
    // be sure to include its associated Product data
    const tag = await Tag.findOne({ where: { id: req.params.id }, include: [Product] });

    // Couldn't find Tag ?
    if (!tag) return res.status(404).json("Tag Was Not Found with This ID");

    // Response
    res.json(tag);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    // create a new tag
    const { tag_name } = req.body; // Getting the User's Input

    // Simple Validation
    if (!tag_name || tag_name === "") return res.status(400).json("Invalid Tag Name Input");

    // Creating the New Tag
    const newTag = await Tag.create({ tag_name });

    // Response
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a tag's name by its `id` value
    const { tag_name } = req.body;
    const { id } = req.params;

    // Simple validation
    if (!tag_name || tag_name === "") return res.status(400).json("Invalid Tag Name Input or No Tag Name Was Provided");

    // Updating The Document
    const newTag = await Tag.update({ tag_name }, { where: { id } });

    // Couldn't Find The Document
    if (!newTag[0]) return res.status(404).json("Tag Was Not Found with This ID or No Tag Name Was Provided or You did Provide The Same Tag Name");

    // Response
    res.json(newTag);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete on tag by its `id` value
    const tagToDelete = await Tag.destroy({ where: { id: req.params.id } });

    // Couldn't Find Document ?
    if (!tagToDelete) return res.status(404).json("Tag Was Not Found with This ID");

    // Response 
    res.json(tagToDelete);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
