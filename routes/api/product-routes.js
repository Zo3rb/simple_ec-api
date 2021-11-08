const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // find all products
    // be sure to include its associated Category and Tag data
    const data = await Product.findAll({ include: [Category, Tag] });
    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // find a single product by its `id`
    // be sure to include its associated Category and Tag data

    const { id } = req.params; // Capture The Route's Param.

    // Perform The DB Async Request
    const product = await Product.findOne({ where: { id }, include: [Category, Tag] });

    // Couldn't Find the Product ?
    if (!product) return res.status(404).json("Product Was Not Found with This ID");

    // Response
    res.json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  // Product.create(req.body)
  //   .then((product) => {
  //     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //     if (req.body.tagIds.length) {
  //       const productTagIdArr = req.body.tagIds.map((tag_id) => {
  //         return {
  //           product_id: product.id,
  //           tag_id,
  //         };
  //       });
  //       return ProductTag.bulkCreate(productTagIdArr);
  //     }
  //     // if no product tags, just respond
  //     res.status(200).json(product);
  //   })
  //   .then((productTagIds) => res.status(200).json(productTagIds))
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(400).json(err);
  //   });

  try {
    // Validate The User Inputs -- Only Product Name & Price are Required
    if (!req.body.product_name || req.body.product_name === "" || !req.body.price || req.body.price === "") {
      return res.status(400).json("Invalid Product Inputs!");
    }

    // Create The Product
    const newProduct = await Product.create(req.body);
    // if Tags ?
    let productTags;
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      productTags = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(201).json({ newProduct, productTags });
    }

    // Response
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  // Product.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((product) => {
  //     // find all associated tags from ProductTag
  //     return ProductTag.findAll({ where: { product_id: req.params.id } });
  //   })
  //   .then((productTags) => {
  //     // get list of current tag_ids
  //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //     // create filtered list of new tag_ids
  //     const newProductTags = req.body.tagIds
  //       .filter((tag_id) => !productTagIds.includes(tag_id))
  //       .map((tag_id) => {
  //         return {
  //           product_id: req.params.id,
  //           tag_id,
  //         };
  //       });
  //     // figure out which ones to remove
  //     const productTagsToRemove = productTags
  //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //       .map(({ id }) => id);

  //     // run both actions
  //     return Promise.all([
  //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //       ProductTag.bulkCreate(newProductTags),
  //     ]);
  //   })
  //   .then((updatedProductTags) => res.json(updatedProductTags))
  //   .catch((err) => {
  //     // console.log(err);
  //     res.status(400).json(err);
  //   });

  try {
    // Update The Document
    const updatedProduct = await Product.update(req.body, { where: { id: req.params.id } });

    // If Couldn't Found the Document or no Data was Provided to Update - at least a single property with tagIds if Wanted to Update it only.
    if (!updatedProduct[0]) return res.status(404).json("Product Was Not Found with This ID or Bad Inputs");

    // If tagIds Was Provided
    if (req.body.tagIds || req.body.tagIds.length) {
      // 1 - Destroy all tags For this Product
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      // 2 - Add the New Tags to this Product
      let newTags = req.body.tagIds.map(tag => {
        return { tag_id: tag, product_id: req.params.id };
      })
      await ProductTag.bulkCreate(newTags);
    }

    // Response
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete one product by its `id` value
    const productToDelete = await Product.destroy({ where: { id: req.params.id } });

    // If Couldn't find the document
    if (!productToDelete) return res.status(404).json("Product Was Not Found with This ID");

    // Response
    res.json(productToDelete);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
