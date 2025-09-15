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
            const contactsRef = db.collection('contacts');
            const snapshot = await contactsRef.get();
            const contacts = [];
            snapshot.forEach((doc) => {
                contacts.push({ id: doc.id, ...doc.data() });
            });
            return contacts;

        } catch (er) {
            console.log('Error in getting contacts',er)
            throw new Error('Could not fetch contacts');

        }
    }
}

export default ContactService;