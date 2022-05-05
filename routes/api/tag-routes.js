const router = require('express').Router();
const res = require('express/lib/response');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      attributes:{
        include:
        [{
          model: Product,
          // through: ProductTag,
          // as: "product_info"
        }]
      }
    });
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tagData = await Product.findByPk(req.params.id,
      {
        attributes:{
          include:
          {
            model: Product,
            // through: ProductTag,
            // as: "product_info"
          }
        }
      });
      if(!tagData){
        res.status(404).json({message: "no tags with this id"});
        return;
      }
      res.status(200).json(tagData)
  } catch(err){
    res.status(500).json(err)
  }
});

router.post('/', async(req, res) => {
  // create a new tag
  try{
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err){
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(()=> {
    return ProductTag.findAll({ where: {
      tag_id: req.params.id
    }});
  })
  .then((productTags)=>{
    const productTagIds = productTags.map(({product_id}) => product_id);
    const newProductTags = req.body.productIds
    .filter((product_id)=> !productTagIds.include(product_id))
    .map((product_id)=> {
      return {
        product_id,
        tag_id: req.params.id
      };
    });
    const productTagsToRemove = productTags
    .filter(({product_id}) => !req.body.productIds.includes(product_id))
    .map(({id}) => id);
    return Promise.all([
      ProductTag.destroy( { where: {id: productTagsToRemove}}),
      ProductTag.bulkCreate(newProductTags),
    ]);
  })
  .then((updatedProductTags) => res.json(updatedProductTags))
  .catch((err)=> {
    res.status(400).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destr(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(()=> {
    return ProductTag.findAll({ where: {
      tag_id: req.params.id
    }});
  })
  .then((productTags)=>{
    const productTagIds = productTags.map(({product_id}) => product_id);
    const newProductTags = req.body.productIds
    .filter((product_id)=> !productTagIds.include(product_id))
    .map((product_id)=> {
      return {
        product_id,
        tag_id: req.params.id
      };
    });
    const productTagsToRemove = productTags
    .filter(({product_id}) => !req.body.productIds.includes(product_id))
    .map(({id}) => id);
    return Promise.all([
      ProductTag.destroy( { where: {id: productTagsToRemove}})
    ]);
  })
  .then((updatedProductTags) => res.json(updatedProductTags))
  .catch((err)=> {
    res.status(400).json(err);
  })
});

module.exports = router;
