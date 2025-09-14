import express from 'express'
import ContactController from '../../controllers/contact_controller/contact_controller.js';
const rouyter = express.Router();


rouyter.post('/contact', ContactController.createContact);
rouyter.get('/contacts', ContactController.getContacts);

export default rouyter
