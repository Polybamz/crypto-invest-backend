import shopService from '../../services/shop/shop_service.js';

class ShopController {
    // GET /api/shop - Get all shop items
    async getAllItems(req, res) {
        try {
            const result = await shopService.getAllItems();
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Shop items retrieved successfully'
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error getting all items:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // GET /api/shop/:id - Get single shop item
    async getItemById(req, res) {
        try {
            const { id } = req.params;
            const result = await shopService.getItemById(id);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Shop item retrieved successfully'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error getting item by ID:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // POST /api/shop - Create new shop item
    async createItem(req, res) {
        try {
            const itemData = req.body;
            const result = await shopService.createItem(itemData);
            
            if (result.success) {
                return res.status(201).json({
                    success: true,
                    data: result.data,
                    message: 'Shop item created successfully'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error creating item:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // PUT /api/shop/:id - Update shop item
    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await shopService.updateItem(id, updateData);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Shop item updated successfully'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error updating item:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // DELETE /api/shop/:id - Delete shop item
    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            const result = await shopService.deleteItem(id);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error deleting item:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // GET /api/shop/stock/:status - Get items by stock status
    async getItemsByStock(req, res) {
        try {
            const { status } = req.params;
            const inStock = status === 'true' || status === true;
            const result = await shopService.getItemsByStock(inStock);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: `${inStock ? 'In stock' : 'Out of stock'} items retrieved successfully`
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error getting items by stock:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // GET /api/shop/search/:term - Search items by name
    async searchItems(req, res) {
        try {
            const { term } = req.params;
            const result = await shopService.searchItems(term);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Search completed successfully'
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Controller error searching items:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export default new ShopController();
