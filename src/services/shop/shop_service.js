import { admin, db } from '../../config/config.js';
import { validateShopItemSchema } from '../../models/shop/item_model.js';

class ShopService {
    constructor() {
        this.collection = db.collection('shop');
    }

    // Get all shop items
    async getAllItems() {
        try {
            const snapshot = await this.collection.get();
            const items = [];
            snapshot.forEach(doc => {
                items.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return { success: true, data: items };
        } catch (error) {
            console.error('Error getting shop items:', error);
            return { success: false, error: error.message };
        }
    }

    // Get single shop item by ID
    async getItemById(itemId) {
        try {
            const doc = await this.collection.doc(itemId).get();
            if (!doc.exists) {
                return { success: false, error: 'Item not found' };
            }
            return { 
                success: true, 
                data: { id: doc.id, ...doc.data() } 
            };
        } catch (error) {
            console.error('Error getting shop item:', error);
            return { success: false, error: error.message };
        }
    }

    // Create new shop item
    async createItem(itemData) {
        try {
            // Validate the item data
            const { value, error } = validateShopItemSchema(itemData);
            if (error) {
                return { success: false, error };
            }

            // Add timestamp
            const item = {
                ...value,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.collection.add(item);
            return { 
                success: true, 
                data: { id: docRef.id, ...item } 
            };
        } catch (error) {
            console.error('Error creating shop item:', error);
            return { success: false, error: error.message };
        }
    }

    // Update shop item
    async updateItem(itemId, updateData) {
        try {
            // Validate the update data
            const { value, error } = validateShopItemSchema(updateData);
            if (error) {
                return { success: false, error };
            }

            const item = {
                ...value,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await this.collection.doc(itemId).update(item);
            return { 
                success: true, 
                data: { id: itemId, ...item } 
            };
        } catch (error) {
            console.error('Error updating shop item:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete shop item
    async deleteItem(itemId) {
        try {
            await this.collection.doc(itemId).delete();
            return { success: true, message: 'Item deleted successfully' };
        } catch (error) {
            console.error('Error deleting shop item:', error);
            return { success: false, error: error.message };
        }
    }

    // Get items by stock status
    async getItemsByStock(inStock = true) {
        try {
            const snapshot = await this.collection.where('inStock', '==', inStock).get();
            const items = [];
            snapshot.forEach(doc => {
                items.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return { success: true, data: items };
        } catch (error) {
            console.error('Error getting items by stock:', error);
            return { success: false, error: error.message };
        }
    }

    // Search items by name
    async searchItems(searchTerm) {
        try {
            const snapshot = await this.collection.get();
            const items = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    items.push({
                        id: doc.id,
                        ...data
                    });
                }
            });
            return { success: true, data: items };
        } catch (error) {
            console.error('Error searching items:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new ShopService();
