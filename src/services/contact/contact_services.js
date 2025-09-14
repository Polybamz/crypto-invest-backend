import { db } from '../../config/config.js';

class ContactService {
    static async createContact(contactDetails) {
        console.log('contactDetails', contactDetails);
        try {
            await db.collection('contacts').doc().set(
               contactDetails
           )
           console.log('Contact created successfully');
            return true
        } catch (er) {
            console.log('Error in creating contact',er)
            return er
        }
    }
    static async getContacts() {
        try {

        } catch (er) {

        }
    }
}

export default ContactService;