import express from 'express';
import  FeedbackController  from '../../controllers/feedback_controller/feedback_controller.js';


const router = express.Router();

router.post('/feedback', FeedbackController.createFeedback);
router.get('/feedbacks', FeedbackController.getFeedbacks);
router.delete('/feedback/:id', FeedbackController.deleteFeedback);
// update feedback route will be added later
router.put('/feedback', FeedbackController.updateFeedback);
export default router;