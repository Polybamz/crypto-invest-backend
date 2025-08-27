// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
import 'firebase/auth';
import 'dotenv/config'

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