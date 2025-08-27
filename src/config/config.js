// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
import 'firebase/auth';
import dotenv from 'dotenv';
dotenv.config();
console.log('TYPEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',process.env.TYPE)
console.log('PRIVATE_KEY_ID',process.env.PRIVATE_KEY_ID)
console.log('PRIVATE_KEY',process.env.PRIVATE_KEY)
console.log('CLIENT_EMAIL',process.env.CLIENT_EMAIL)
console.log('CLIENT_ID',process.env.CLIENT_ID)
console.log('AUTH_UR',process.env.AUTH_URI)
console.log('TOKEN_URI',process.env.TOKEN_URI)
console.log('AUTH_PROVIDER',process.env.AUTH_PROVIDER)
console.log('CERT_URL',process.env.CERT_URL)
console.log('DOMAIN',process.env.DOMAIN)
console.log('Porttttttttttttt', process.env.PORT)

admin.initializeApp({
    credential: admin.credential.cert({
        "type":process.env.TYPE,
        "project_id": "criptoi",
        "private_key_id":process.env.PRIVATE_KEY_ID,
        "private_key":process.env.PRIVATE_KEY,
        "client_email":process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_UR,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
        "client_x509_cert_url": process.env.CERT_URL,
        "universe_domain": process.env.DOMAIN
    }
    ),
});

const db = admin.firestore();

export { admin, db };