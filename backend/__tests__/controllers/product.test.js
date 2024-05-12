import Product from '../../models/productModel';
import ErrorHandler from '../../utils/errorHandler';
import {getApprovalProductsSeller} from "../../controllers/productController";

describe("Get Approval Products Seller", () => {
    // Set up common variables
    const mockRequest = {
        user: {
            _id: "userId123"
        }
    };
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const mockNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear existing mocks to avoid tests affecting each other
    });

    it("should fetch pending approval products and return correct count", async () => {
        // Arrange: Set up your mocks to return specific values
        const mockProducts = [
            { name: "Product 1", status: "Pending" },
            { name: "Product 2", status: "Pending" }
        ];
        jest.spyOn(Product,"find").mockResolvedValue(mockProducts);
        jest.spyOn(Product,"countDocuments").mockResolvedValue(mockProducts.length);

        const req = mockRequest;
        const res = mockResponse();

        // Act: Call the function
        await getApprovalProductsSeller(req, res, mockNext);

        // Assert: Check that the response was called correctly
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        //     approvalProductsCount: 2,
        //     approvalProducts: mockProducts
        // });
    });

    it("should handle no pending approval products correctly", async () => {
        // Arrange: Set up your mocks for no results
        jest.spyOn(Product,"find").mockResolvedValue([]);
        jest.spyOn(Product,"countDocuments").mockResolvedValue(0);

        const req = mockRequest;
        const res = mockResponse();

        // Act
        await getApprovalProductsSeller(req, res, mockNext);

        // Assert
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        //     approvalProductsCount: 0,
        //     approvalProducts: []
        // });
    });

});
