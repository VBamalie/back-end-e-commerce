const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [Product],
  })
  .then((categories)=> res.json(categories))
  .catchThrow((err)=> res.status(500).json(err))
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findByPk(req.params.id, 
    {include:{model: Product}}
    )
    .then((categories)=>{
      if(!categories){res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    else res.json(categories)
    })
    .catchThrow((err)=> res.status(500).json(err))
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Product.create(req.body);
    res.status(200).json(categoryData);
  } catch (err){
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const categoryData =  await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err){
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const categoryData = await Product.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    );

    if(!categoryData) {
      res.status(400).json({message: "no category found"});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
