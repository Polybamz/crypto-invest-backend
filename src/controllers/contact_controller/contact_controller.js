import ContactService from '../../services/contact/contact_services.js'
import {
    contactSchema,
    validateContact
} from '../../models/contact/contact_model.js'
import { admin } from '../../config/config.js'

class ContactController {
    static async createContact(req, res) {
        const  data  = req.body
        // console.log('data', data);
        try {
            const { error, value } = validateContact(data)
            if (error) throw Error(error)
            const result = await ContactService.createContact({...value, createdAt: admin.firestore.Timestamp.now().toDate(), updatedAt: admin.firestore.Timestamp.now().toDate()})

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Contact created successfully'

                })
            } else {
                return res.status(401).json({
                    success: false
                })
            }
        } catch (er) {
            return res.status(500).json({ success: false, error: er.message })

        }
    }

    static async getContacts(req, res) {
        try {
            const result = await ContactService.getContacts()
            if (result) {
                return res.status(200).json({
                    success: true,
                    data: result
                })
            } else {
                return res.status(401).json({
                    success: false
                })
            }
        } catch (er) {
            return res.status(500).json({ success: false, error: er.message })

        }
    }

}

export default ContactController