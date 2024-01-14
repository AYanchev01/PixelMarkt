# PixelMarkt

PixelMarkt is an e-commerce web application designed for browsing and purchasing PC equipment. It features a product catalog, user authentication, shopping cart functionality, and secure checkout with Stripe payment processing.

> **Disclaimer:** This project is developed for educational purposes as part of the E-business class curriculum at Sofia University. It is not intended for production use.

## Quick Start

To get started with PixelMarkt, you need to set up a few things:

### Prerequisites

1. A Firebase project with Firestore, Authentication, Storage, and the Stripe extension configured.
2. A Stripe account for handling payments.

### Configuration

1. Place your `serviceAccountKey.json` file from Firebase in the `config/` directory.

2. Create an `.env` file in the root of your project with the following structure:

```sh
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
FIREBASE_STORAGE_BUCKET_URL=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
```

### Running the Application

With Node.js installed, run the following commands to start the application:

```sh
npm install
npm start
```

This will launch the PixelMarkt app on <http://localhost:3000>.

## Features

- User authentication with Google and email.
- Product catalog with search functionality.
- Shopping cart management.
- Secure payment processing with Stripe.
- Catalog administation with admin users (refer to README in scripts/ directory)

## Educational Context

This project was created as a part of the E-business course at Sofia University to demonstrate the practical application of web development principles in e-commerce. It showcases the use of several technologies, including:

- Client: React application with TypeScript
- Authentication: Firebase Auth
- Database: Firestore (NoSQL database)
- Cloud Storage: Firebase Storage for media files
- Payments: Stripe for payment processing

## License

This project is licensed under the MIT License.
