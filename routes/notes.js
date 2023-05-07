/*
- Notes (requires authentication)
  - Create: `POST /notes`
  - Get all of my notes: `GET /notes`
  - Get a single note: `GET /notes/:id`
*/
const { Router } = require("express");
const router = Router({ mergeParams: true });

// const transactionDAO = require('../daos/transaction');
const userDAO = require('../daos/user');

/*
router.use(async (req, res, next) => {
  const { userId } = req.params;
  // this isn't in a trycatch so invalid issues will throw mongo errors
  // i.e id needs to be valid, but we can handle it if it's not in use 
  // with the !user statement
  try {
    const user = await userDAO.getById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      req.user = user;
      next();
    }
  } catch(e) {
    // this will go to the error function in index
    next(e);
  }
  
})

// Create
router.post("/", async (req, res, next) => {
  const userId = req.params.userId;
  const transaction = req.body;
  //transaction.userId = userId;
  if (!transaction || JSON.stringify(transaction) === '{}' ) {
    res.status(400).send('transaction is required');
  } else {
    try {
      //const savedtransaction = await transactionDAO.create(transaction);
      //res.json(savedtransaction); 
    } catch(e) {
      res.status(500).send(e.message);
    }
  }
});

// Read - single transaction
router.get("/:id", async (req, res, next) => {
  // const userId = req.params.userId;
  const userId = req.user._id;
  console.log(req.user);
  try {
    // const transaction = await transactionDAO.getById(userId, req.params.id);
    // TODO populate user field in response with actual user data
    if (transaction) {
      res.json(transaction);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Read - all transactions
router.get("/", async (req, res, next) => {
  // const userId = req.params.userId;
  const userId = req.user._id;
  console.log(req.user);
  let { page, perPage } = req.query;
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const transactions = await transactionDAO.getAll(userId, page, perPage);
  res.json(transactions);
});

// Update
router.put("/:id", async (req, res, next) => {
  const userId = req.params.userId;
  const transactionId = req.params.id;
  const transaction = req.body;
  transaction.userId = userId;
  if (!transaction || JSON.stringify(transaction) === '{}' ) {
    res.status(400).send('transaction is required"');
  } else {
    try {
      const updatedtransaction = await transactionDAO.updateById(userId, transactionId, transaction);
      res.json(updatedtransaction);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const userId = req.params.userId;
  const transactionId = req.params.id;
  try {
    await transactionDAO.deleteById(userId, transactionId);
    res.sendStatus(200);
  } catch(e) {
    res.status(500).send(e.message);
  }
});
*/

module.exports = router;
