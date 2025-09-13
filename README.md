# crypto-invest-backend
This is the backend server for the Crypto Invest application. It is built using Node.js and Express.
Node.js version: 20.x or higher


Create a .env file in the root directory and add your environment variables. You can use the .env.example file as a template.

```
cp .env.example .env
```

##Install the dependencies:

```
npm install
```

##Start the server:

```
npm run dev
```

The server will be running on port 8080.


#Referral cade is asigned during sign up

##Folder structure
```

├── controllers
│   ├── auth.controller.js
│   ├── referral.controller.js
│   └── user.controller.js
├── models 
│   ├── referral.model.js
│   └── user.model.js
├── routes
│   ├── auth.route.js
│   ├── referral.route.js
│   └── user.route.js
├── services
│   ├── auth.service.js
│   ├── referral.service.js
│   └── user.service.js
├── .env
├──  index.js
├──  package.json
├──  README.md
└──  package-lock.json
```