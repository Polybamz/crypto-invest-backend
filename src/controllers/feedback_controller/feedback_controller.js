import { feedbackSchema } from "../../models/feedbacks/feedbacks_model.js";
import feedbackService from "../../services/feedback/feedback_servce.js";

class FeedbackController {
    static async createFeedback(req, res) {
        const  data  = req.body;
        console.log('ddddddddddddddddddddddddddddddddddd',data)
       try {
            const { value, error } = feedbackSchema.validate(data);
            if (error) {
                
                console.log('errrrrrrrr',error)
                throw Error(error.message)};
            const result = await feedbackService.createFeedback(value);
            if (result) {
                return res.status(201).json({
                    message: "Feedback created successfully",
                    data: result,
                });
            } else {
                return res.status(400).json({
                    message: "Failed to create feedback",
                });
            }} catch (er) {
            return res.status(500).json({ message: "Internal server error", error: er });
        }
    }

    static async getFeedbacks(req, res) {
        try {
            const feedbacks = await feedbackService.getFeedbacks();
            return res.status(200).json({
                message: "Feedbacks fetched successfully",
                data: feedbacks,
            });
        } catch (er) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    static async deleteFeedback(req, res) {
        const { id } = req.params;
        try {
            const result = await feedbackService.deleteFeedback(id);
            if (result) {
                return res.status(200).json({
                    message: "Feedback deleted successfully",
                });
            } else {
                return res.status(404).json({
                    message: "Feedback not found",
                });
            }
        } catch (er) {
            return res.status(500).json({ message: "Internal server error" });
        }


    }

   static async updateFeedback(req, res) {
    const {data} = req.body
    try {
        const { value, error } = feedbackSchema.validate(data);
        if (error) {
            throw Error(error.message)};
        const result = await feedbackService.updateFeedback(data);
        if (result) {
            return res.status(200).json({
                message: "Feedback updated successfully",
                data: result,
            });
        } else {
            return res.status(404).json({
                message: "Feedback not found",
            });
        }
    } catch (er){
        return res.status(500).json({ message: "Internal server error", error: er });
    }
            
    }
}


export default FeedbackController;