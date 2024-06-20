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
    REACT_APP_MAILCHIMP_U=your_mailchimp_user_key
    REACT_APP_MAILCHIMP_ID=your_mailchimp_list_id
    REACT_APP_STRIPE_PK=your_stripe_publishable_key
    REACT_APP_URL=http://localhost:3000
    REACT_APP_SOCKET_URL=http://localhost:8080
    REACT_APP_API_URL=http://localhost:8000
    ```

    #### Backend
    Create a `config.env` file in the backend/config folder and add the following variables:

    ```env
    PORT=8000
    DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nelami?retryWrites=true&w=majority
    FRONTEND_URL=http://localhost:3000
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=7d
    COOKIE_EXPIRE=7
    SMTP_SERVICE=gmail
    SMTP_MAIL=youremail@gmail.com
    SMTP_PASSWORD=your_smtp_password
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    CLOUDINARY_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    STRIPE_API_KEY=your_stripe_api_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

    > Make sure to replace the placeholder values with your actual configuration details before running the application.


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
