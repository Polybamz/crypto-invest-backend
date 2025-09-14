import express from 'express';
import shopController from '../../controllers/shop/shop_controller.js';

const router = express.Router();

// GET /api/shop - Get all shop items
router.get('/shop', shopController.getAllItems);

// GET /api/shop/search/:term - Search items by name
router.get('/shop/search/:term', shopController.searchItems);

// GET /api/shop/stock/:status - Get items by stock status (true/false)
router.get('/shop/stock/:status', shopController.getItemsByStock);

// GET /api/shop/:id - Get single shop item by ID
router.get('/shop/:id', shopController.getItemById);

// POST /api/shop - Create new shop item
router.post('/shop', shopController.createItem);

// PUT /api/shop/:id - Update shop item
router.put('/shop/:id', shopController.updateItem);

// DELETE /api/shop/:id - Delete shop item
router.delete('/shop/:id', shopController.deleteItem);

export default router;
