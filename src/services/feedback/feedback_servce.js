import { db,admin } from "../../config/config.js"
class feedbackService  {
    static async createFeedback(data) {
        console.log('ggggggggggggggggggggggggggggggg',data)
        try {
            const feedbackRef = db.collection('feedbacks');
            const feedback = await feedbackRef.add(data);
            return true;
        } catch (error) {
            console.error("Error adding feedback: ", error);
            return false;
        }
    }
    static async getFeedbacks() {
        try {
            const feedbackRef = db.collection('feedbacks');
            const snapshot = await feedbackRef.get();
            const feedbacks = [];
            snapshot.forEach((doc) => {
                feedbacks.push({ id: doc.id, ...doc.data() });
            });
            return feedbacks;
        } catch (error) {
            console.error("Error getting feedbacks: ", error);
            throw new Error('Could not fetch feedbacks');
        }
    }
   static async deleteFeedback(id) {
    try {
        console.log('id', id);
        // Query feedbacks where 'id' matches
        const feedbackRef = db.collection('feedbacks').where('id', '==', id);
        const snapshot = await feedbackRef.get();
        if (snapshot.empty) {
            throw new Error('Feedback not found');
        }
        // Delete all matching documents (should be one, but just in case)
        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error deleting feedback: ", error);
        throw Error(error);
    }
}

static async updateFeedback(data) {
    try {
        const feedbackRef = db.collection('feedbacks').where('id' ,'==', data.id);
        const snapshot = await feedbackRef.get();
        if (snapshot.empty) {
            throw new Error('Feedback not found');
        }
        const feedback = snapshot.docs[0].data();
        const updates = {
            ...data,
            updated_at: new Date()
        };
        const batch = db.batch();
        batch.update(snapshot.docs[0].ref, updates);
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error updating feedback: ", error);
        throw Error(error);
    }

}

}

export default feedbackService
