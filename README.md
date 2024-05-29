# Nelami

Nelami is an innovative platform designed to connect buyers and sellers through a bidding system where buyers can bid on products that the sellers post, and the top bidder wins the auction when it ends. This repository contains the source code and documentation for the Nelami project.

## Features

- **User Authentication**: Secure login and registration for users.
- **Bidding System**: Seamless bidding system for participating in auctions.
- **User Profiles**: Manage user profiles with detailed information.
- **Product Listings**: Browse and search for available products.
- **Email Notifications**: Get updates through emails.
- **Payment Integration**: Secure payment processing for transactions.
- **Admin Dashboard**: Interactive admin interface for managing products and users.
- **Responsive Design**: Optimized for both desktop and mobile platforms.

## Technologies Used

- **Frontend**: React.js, Redux, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Stripe
- **Real-Time Communication**: Socket.IO
- **Deployment**: VPS

## Folder Structure

### Frontend

```
nelami/
└── frontend/
    ├───public/
    ├───src/
    |   ├───Components/
    |   │   ├───conversations/
    |   │   ├───Footer/
    |   │   ├───Header/
    |   │   ├───HeroSlider/
    |   │   ├───Loader/
    |   │   ├───MailchimpFormContainer/
    |   │   ├───message/
    |   │   └───ProductCard/
    |   ├───helpers/
    |   ├───hooks/
    |   ├───pages/
    |   │   ├───AdminDashboard/
    |   │   │   ├───AllProducts/
    |   │   │   ├───AllUsers/
    |   │   │   ├───ApprovalProducts/
    |   │   │   ├───EditFeatures/
    |   │   │   ├───Profile/
    |   │   │   ├───Settings/
    |   │   │   └───StatsDashboard/
    |   │   ├───CategoryPage/
    |   │   ├───Checkout/
    |   │   ├───Contact/
    |   │   ├───Dashboard/
    |   │   │   ├───MyBids/
    |   │   │   ├───MyProducts/
    |   │   │   ├───MyWishlist/
    |   │   │   ├───Profile/
    |   │   │   ├───SafetyTips/
    |   │   │   ├───Settings/
    |   │   │   └───StatsDashboard/
    |   │   ├───Error/
    |   │   ├───ForgotPassword/
    |   │   ├───Home/
    |   │   ├───Login/
    |   │   ├───Logout/
    |   │   ├───messanger/
    |   │   ├───PackagesPricing/
    |   │   ├───ProductForms/
    |   │   │   ├───Misc/
    |   │   │   ├───Properties/
    |   │   │   └───Vehicles/
    |   │   ├───ProductsPage/
    |   │   ├───ResetPassword/
    |   │   ├───SellerProfile/
    |   │   ├───SignUp/
    |   │   └───SingleProduct/
    |   ├───reducers/
    |   └───utils/
    ├───.env
    └───package.json
```


### Backend

```
nelami/
└── backend/
    ├───config/
    |    └── [configuration files like config.env]
    ├───controllers/
    ├───middleware/
    ├───models/
    ├───routes/
    ├───utils/
    ├───__tests__/
    |    └───controllers/
    ├───app.js
    ├───server.js
    └───package.json
```

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Hamzi-SE/nelami.git
    cd nelami
    ```

2. **Install dependencies:**

    ```bash
    cd backend
    npm install
    cd ..
    cd frontend
    npm install
    cd ..
    ```

3. **Set up environment variables:**

    #### Frontend
    Create a `.env` file in the frontend folder and add the following variables:

    ```env
    REACT_APP_MAILCHIMP_U
    REACT_APP_MAILCHIMP_ID
    REACT_APP_STRIPE_PK
    REACT_APP_URL
    REACT_APP_SOCKET_URL
    REACT_APP_API_URL
    ```

    #### Backend
    Create a `config.env` file in the backend/config folder and add the following variables:

    ```env
    PORT
    DB_URI
    FRONTEND_URL
    JWT_SECRET
    JWT_EXPIRE
    COOKIE_EXPIRE
    SMTP_SERVICE
    SMTP_MAIL
    SMTP_PASSWORD
    SMTP_HOST
    SMTP_PORT
    CLOUDINARY_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    STRIPE_API_KEY
    STRIPE_SECRET_KEY
    ```

4. **Run the application:**

    #### Frontend
    ```bash
    cd frontend
    npm start
    ```

    #### Backend
    Open another terminal and go to backend folder
    ```bash
    cd backend
    npm run dev
    ```

    This will start both the server and the client in development mode.


## Contributing

We welcome contributions to Nelami! To contribute, please fork the repository, create a new branch, and submit a pull request.

### Steps to Contribute

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.