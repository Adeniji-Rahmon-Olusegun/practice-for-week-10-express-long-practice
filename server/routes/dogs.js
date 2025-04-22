// ------------------------------  SERVER DATA ------------------------------  

let nextDogId = 1;
function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const dogs = [
  {
    dogId: getNewDogId(),
    name: "Fluffy"
  },
  {
    dogId: getNewDogId(),
    name: "Digby"
  }
];

// ------------------------------  MIDDLEWARES ------------------------------ 

const validateDogInfo = (req, res, next) => {
  if (!req.body || !req.body.name) {
    const err = new Error("Dog must have a name");
    err.statusCode = 400;
    next(err);
  }
  next();
};

const validateDogId = (req, res, next) => {
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  if (!dog) {
    const err = new Error("Couldn't find dog with that dogId")
    err.statusCode = 404;
    throw err;
    // return next(err); // alternative to throwing it
  }
  next();
}

// ------------------------------  ROUTE HANDLERS ------------------------------  

// GET /dogs
const getAllDogs = (req, res) => {
  res.json(dogs);
};

// GET /dogs/:dogId
const getDogById = (req, res, next) => {
  
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);

  //if (!dog) validateDogId(req, res, next);
  res.json(dog);
}

// POST /dogs
const createDog = (req, res) => {
  
  const { name } = req.body;
  const newDog = {
    dogId: getNewDogId(),
    name
  }

  dogs.push(newDog);
  res.json(newDog);
};

// PUT /dogs/:dogId
const updateDog = (req, res, next) => {
  
  const { name } = req.body;
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  
  //if (!dog) validateDogId(req, res, next);
  dog.name = name;
  res.json(dog);
};

// DELETE /dogs/:dogId
const deleteDog = (req, res, next) => {
  const { dogId } = req.params;
  const dogIdx = dogs.findIndex(dog => dog.dogId == dogId);

  //if (!dogs) validateDogId(req, res, next)
  dogs.splice(dogIdx, 1);
  res.json({ message: "success" });
};

// ------------------------------  ROUTER ------------------------------  

// Your code here
const express = require('express');

const router = express.Router();
const foodRouter = require('./dog-foods');

router.use('/:dogId', validateDogId);


router.get('/', getAllDogs);
router.get('/:dogId', getDogById);
router.post('/', validateDogInfo, createDog);
router.put('/:dogId', updateDog);
router.delete('/:dogId', deleteDog);

router.use('/:dogId/foods', foodRouter);

module.exports = router;