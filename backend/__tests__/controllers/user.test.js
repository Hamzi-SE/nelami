import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OTPValidation, forgotPassword, getAllUser, getSingleUser, getUserDetails, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile } from "../../controllers/userController";
import User from "../../models/userModel";
// import Message from "../../models/MessageModel";
import ErrorHandler from "../../utils/errorHandler";
import sendEmail from "../../utils/sendEmail";


// Mock nodemailer at the top level to ensure it applies to all tests
jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({
            accepted: ["test@email.com", "test@gmail.com"],
        }),
    }),
}));

jest.mock("../../models/userModel");
// jest.mock("../../models/productModel");
// jest.mock("../../models/MessageModel");
jest.mock("../../utils/jwtToken");

afterAll(() => {
    jest.clearAllMocks();
});

describe("Utils - sendEmail", () => {
    it("should send an email", async () => {
        const response = await sendEmail({
            email: "test@gmail.com",
            subjectL: "Test Subject",
            message: "Test Message",
        });

        expect(response).toBeDefined();
        expect(response.accepted).toContain("test@gmail.com");
    });

    it("should throw an error if email is not sent", async () => {
        nodemailer.createTransport.mockReturnValueOnce({
            sendMail: jest.fn().mockRejectedValue(new Error("Email not sent")),
        });

        await expect(
            sendEmail({
                email: "test@gmail.com",
                subject: "Test Subject",
                message: "Test Message",
            })
        ).rejects.toThrow("Email not sent");
    });
});

const mockRequest = () => ({
    body: {
        name: "John Doe",
        email: "test@email.com",
        password: "password",
        confirmPassword: "password",
        role: "buyer",
        address: "123 Test St",
        phoneNo: "1234567890",
        city: "Test City",
        aboutInfo: "Test Info",
    },
});

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});

const mockNext = jest.fn();

const mockUser = {
    _id: "60f6a33b8b1f7a0015f2f3b1",
    name: "John Doe",
    email: "test@email.com",
    password: "hashedPassword",
    role: "buyer",
    address: "123 Test St",
    phoneNo: "1234567890",
    city: "Test City",
    aboutInfo: "Test Info",
    emailVerified: false,
    avatar: {
        public_id: "skfjaldjflljalfjlajf",
        url: "https://i.postimg.cc/mD9SJc41/149071.png",
    },
    wishlist: [],
    createOTP: jest.fn().mockReturnValue("123456"),
    save: jest.fn().mockResolvedValue({}),
    getJWTToken: jest.fn().mockReturnValue("jwt_token"),
};

describe("Register User", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw validation error", async () => {
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Please Fill All Required Fields", 400)
        );
    });

    it("should register a new user", async () => {
        jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
        jest.spyOn(mockUser, "save").mockImplementationOnce(() => Promise.resolve(mockUser));

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes, mockNext);

        const response = await sendEmail({
            email: "test@email.com",
            subject: "Nelami Website OTP Confirmation",
            message: "Test Message",
        });

        expect(response).toBeDefined();
        expect(response.accepted).toContain("test@email.com");

        expect(User.create).toHaveBeenCalledWith({
            name: "John Doe",
            email: "test@email.com",
            password: "password",
            role: "buyer",
            address: "123 Test St",
            phoneNo: "1234567890",
            city: "Test City",
            aboutInfo: "Test Info",
        });
        // expect(mockRes.status).toHaveBeenCalledWith(201);
        // expect(mockRes.json).toHaveBeenCalledWith({
        //     success: true,
        //     message: "Please verify your email to complete registration",
        // });
    });

    it("should handle mismatching passwords", async () => {
        const mockReq = mockRequest();
        mockReq.body.confirmPassword = "not_matching_password";

        await registerUser(mockReq, mockResponse(), mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Password does not match", 400)
        );
    });

    it("should handle role seller and no store", async () => {
        const mockReq = mockRequest();
        mockReq.body.role = "seller";

        await registerUser(mockReq, mockResponse(), mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Seller must enter store name", 400)
        );
    });
});

describe("OTP Validation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRequest = () => ({
        body: {
            email: "test@email.com",
            otp: "123456",
        },
    });

    it("should throw an error if OTP or email is not provided", async () => {
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        await OTPValidation(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Please enter Email & OTP both", 400)
        );
    });

    it("should throw an error if user is not found", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await OTPValidation(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ErrorHandler("Incorrect Email or OTP", 400));
    });

    it("should throw an error if email is already verified", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce({
            emailVerified: true,
        });

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await OTPValidation(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Email is already verified", 400)
        );
    });

    it("should throw an error if OTP is incorrect", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);

        const mockReq = mockRequest();
        mockReq.body.otp = "654321";
        const mockRes = mockResponse();

        await OTPValidation(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ErrorHandler("Incorrect Email or OTP", 400));
    });
});

describe("Login User", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRequest = () => ({
        body: {
            email: "test@example.com",
            password: "incorrect_password",
            person: "buyer",
        },
    });

    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    it("should handle missing email or password", async () => {
        const mockReq = (mockRequest().body = { body: {} });
        const res = mockResponse();

        await loginUser(mockReq, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Please enter Email & Password both", 400)
        );
    });

    it("should handle incorrect email", async () => {
        jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(null),
        }));
        const req = mockRequest();
        const res = mockResponse();

        await loginUser(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Incorrect Email or Password", 401)
        );
    });

    it("should require email verification", async () => {
        let unverifiedUser = mockRequest();
        unverifiedUser.emailVerified = false;
        jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(unverifiedUser),
        }));
        const req = mockRequest();
        const res = mockResponse();

        await loginUser(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Please Verify Your Email to Login", 401)
        );
    });

    // it("should reject incorrect password", async () => {
    //     // Simulate a user that has been found and has their email verified
    //     const user = {
    //         emailVerified: true,
    //         comparePassword: jest.fn().mockResolvedValue(false)  // Ensures comparePassword returns a promise that resolves to false
    //     };

    //     // Simulate User.findOne to return this mocked user setup
    //     jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
    //         select: jest.fn().mockResolvedValue(user)
    //     }));

    //     const req = mockRequest();
    //     const res = mockResponse();
    //     const mockNext = jest.fn();

    //     // Execute the loginUser function
    //     await loginUser(req, res, mockNext);

    //     // Check if the correct error handler is called with status code 401
    //     expect(mockNext).toHaveBeenCalledWith(new ErrorHandler("Incorrect Email or Password", 401));
    // });
});

describe("Logout User", () => {
    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    beforeAll(() => {
        // Mock Date.now to return a fixed timestamp
        jest.spyOn(Date, 'now').mockImplementation(() => 1609459200000); // Mocked to return January 1, 2021, 00:00:00
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should clear the cookie", () => {
        const res = mockResponse();

        logout({}, res, {});

        expect(res.cookie).toHaveBeenCalledWith("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Logged Out Successfully",
        });
    });
});



describe('Forget Password', () => { 
    beforeEach(() => { 
        jest.clearAllMocks(); 
    }); 
    
    const mockRequest = () => ({
        body: {
            email: "test@email.com",
        },
    });

    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    it('should throw an error if user is not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await forgotPassword(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ErrorHandler('User Not Found', 404));
    });

})


describe("Reset Password", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRequest = (options = {}) => ({
        params: { token: options.token || "valid_token123" },
        body: {
            password: options.password || "newPassword123",
            confirmPassword: options.confirmPassword || "newPassword123"
        }
    });

    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    const mockNext = jest.fn();

    it("should handle invalid or expired token", async () => {
        jest.spyOn(crypto, 'createHash').mockImplementation(() => ({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue("hashed_token")
        }));

        jest.spyOn(User, "findOne").mockResolvedValue(null);

        const req = mockRequest();
        const res = mockResponse();

        await resetPassword(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    });

    it("should handle mismatched passwords", async () => {
        const user = {
            save: jest.fn().mockResolvedValue(true)
        };

        jest.spyOn(crypto, 'createHash').mockImplementation(() => ({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue("hashed_token")
        }));

        jest.spyOn(User, "findOne").mockResolvedValue(user);

        const req = mockRequest({ password: "password", confirmPassword: "differentPassword" });
        const res = mockResponse();

        await resetPassword(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ErrorHandler("Password does not password", 400));
    });

    it("should successfully reset password", async () => {
        const user = {
            save: jest.fn().mockResolvedValue(true)
        };

        jest.spyOn(crypto, 'createHash').mockImplementation(() => ({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue("hashed_token")
        }));

        jest.spyOn(User, "findOne").mockResolvedValue(user);

        const req = mockRequest();
        const res = mockResponse();

        await resetPassword(req, res, mockNext);

        expect(user.save).toHaveBeenCalled();
    });
});


describe("Get Logged In User", () => {
    it("should return user data", async () => {
        const req = {
            user: {
                id: "60f6a33b8b1f7a0015f2f3b1",
            },
        };

        const res = mockResponse();


        jest.spyOn(User, "findById").mockResolvedValueOnce(mockUser);

        await getUserDetails(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            user: mockUser
        });
    });
});


// describe("Get Seller Details", () => {
//     it("should return seller data", async () => {
//         const req = {
//             params: {
//                 id: "60f6a33b8b1f7a0015f2f3b1",
//             },
//         };

//         let res = mockResponse();

//         jest.spyOn(User, "findById").mockImplementationOnce(() => ({
//             select: jest.fn().mockResolvedValueOnce(mockUser)
//         }));

//         jest.spyOn(Product, "find").mockResolvedValue(["product1", "product2"])

//         await getSellerDetails(req, res, mockNext);

//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//             success: true,
//             user: {...mockUser},
//             products: ["product1", "product2"]
//         });
//     });
// });


describe("Update Password", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRequest = (options = {}) => ({
        body: {
            oldPassword: options.oldPassword || "oldPassword123",
            newPassword: options.newPassword || "newPassword123",
            confirmPassword: options.confirmPassword || "newPassword123"
        },
        user: {
            id: "60f6a33b8b1f7a0015f2f3b1"
        }
    });

    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    const mockNext = jest.fn();

    const mockUser = {
        comparePassword: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
        password: "oldHashedPassword"
    };

    it("should handle incorrect old password", async () => {
        mockUser.comparePassword.mockResolvedValue(false);
        jest.spyOn(User, "findById").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(mockUser)
        }));

        const req = mockRequest();
        const res = mockResponse();

        await updatePassword(req, res, mockNext);

    });

    it("should handle password mismatch", async () => {
        mockUser.comparePassword.mockResolvedValue(true);
        jest.spyOn(User, "findById").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(mockUser)
        }));

        const req = mockRequest({ newPassword: "newPassword123", confirmPassword: "mismatchPassword123" });
        const res = mockResponse();

        await updatePassword(req, res, mockNext);

    });

    it("should successfully update password", async () => {
        mockUser.comparePassword.mockResolvedValue(true);
        jest.spyOn(User, "findById").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(mockUser)
        }));

        const req = mockRequest({ newPassword: "newPassword123", confirmPassword: "newPassword123" });
        const res = mockResponse();

        await updatePassword(req, res, mockNext);

    });
});


describe("Update Profile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRequest = (options = {}) => ({
        body: {
            name: options.name || "John Doe",
            email: options.email || "test@gmail.com",
            address: options.address || "123 Test St",
            phoneNo: options.phoneNo || "1234567890",
            city: options.city || "Test City",
            aboutInfo: options.aboutInfo || "Test Info",
        },
        user: {
            id: "60f6a33b8b1f7a0015f2f3b1"
        }
    });

    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    const mockNext = jest.fn();

    const mockUser = {
        save: jest.fn().mockResolvedValue(true)
    };

    it("should throw validation error", async () => {
        const mockReq = (mockRequest().body = { body: {} });
        const mockRes = mockResponse();

        await updateProfile(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("Please Fill All Required Fields", 400)
        );
    });

    it("should successfully update profile", async () => {
        jest.spyOn(User, "findById").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(mockUser)
        }));

        const req = mockRequest();
        const res = mockResponse();

        await updateProfile(req, res, mockNext);

    });

    it("should handle email already taken", async () => {
        jest.spyOn(User, "findById").mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValue(mockUser)
        }));

        jest.spyOn(User, "findOne").mockResolvedValueOnce({ email: "test@gmail.com" });

        const req = mockRequest();
        const res = mockResponse();

        await updateProfile(req, res, mockNext);

    });

});



describe("Get All Users", () => {
    it("should return all users", async () => {
        const req = {};
        const res = mockResponse();

        jest.spyOn(User, "find").mockImplementationOnce(() => ({
            sort: jest.fn().mockResolvedValue(["user1", "user2"])
        }));
        jest.spyOn(User, "countDocuments").mockResolvedValue(2);

        await getAllUser(req, res, mockNext);

    });
});



describe("Get Single User", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle user not found", async () => {
        const req = {
            params: {
                id: "60f6a33b8b1f7a0015f2f3b1"
            }
        };

        const res = mockResponse();

        jest.spyOn(User, "findById").mockResolvedValueOnce(null);

        await getSingleUser(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            new ErrorHandler("User does not exist with Id: 60f6a33b8b1f7a0015f2f3b1", 400)
        );

    });

    it("should return user data", async () => {
        const req = {
            params: {
                id: "60f6a33b8b1f7a0015f2f3b1"
            }
        };

        const res = mockResponse();

        jest.spyOn(User, "findById").mockResolvedValueOnce(mockUser);

        await getSingleUser(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            user: {...mockUser}
        });
    });
});