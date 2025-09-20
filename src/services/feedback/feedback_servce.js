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
            const feedbackRef = db.collection('feedbacks').doc(id);
            await feedbackRef.delete();
            return true;
        } catch (error) {
            console.error("Error deleting feedback: ", error);
            return false;
        }
    }

}

export default feedbackService
