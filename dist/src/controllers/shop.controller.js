"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
const shop_model_1 = __importDefault(require("../models/shop.model"));
function all(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const shops = yield shop_model_1.default.findAll();
        res.status(200).json(shops);
    });
}
exports.all = all;
// export async function getSaleById(req: Request, res: Response) {
//   const { SalemanGUID } = req.params;
//   const sale = await Sale.findOne({
//     where: {
//       SalemanGUID: SalemanGUID,
//     },
//     include: [
//       {
//         model: User,
//         as: "Customer",
//       },
//       {
//         model: GlobalType,
//         as: "SaleTypeRef",
//         //  Sale type shoudl be astring value of arributes.GlobaleTypeName
//         attributes: {
//           include: ["GlobalTypeName"],
//           exclude: ["GlobalTypeGUID"],
//         },
//       },
//       {
//         model: SaleDetail,
//         all: true,
//       },
//     ],
//   });
//   if (!sale) {
//     return res.status(404).json({
//       message: "Sale not found",
//     });
//   }
//   if (sale.SaleTypeRef) {
//     sale.setDataValue("SaleType", sale.SaleTypeRef.GlobalTypeName);
//     sale.setDataValue("SaleTypeRef", undefined);
//   }
//   res.status(200).json(sale);
// }
// export const  createSale = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   req.body.CreatedGUID = req.body.user.UserGUID;
//   const transaction = await sequelize.transaction();
//   try {
//     const {
//       SaleOrderID,
//       SaleOrderDate,
//       ModeOfPayment,
//       SaleChannel,
//       SalePlatform,
//       CustomerGUID = req.body.user.UserGUID,
//       SalesDetails,
//       CreatedGUID,
//       PaymentTransactionID,
//       PromotionGUID,
//       TotalAmount,
//     } = req.body;
//     const saleData = {
//       SaleOrderID,
//       SaleOrderDate,
//       SaleChannel,
//       CustomerGUID,
//       CreatedGUID,
//       SalePlatform,
//       ModeOfPayment,
//       PaymentTransactionID,
//       PromotionGUID,
//       TotalAmount,
//     };
//     function checkSufficientBalance(
//       TotalAmount: number,
//       WalletBalance: number
//     ) {
//       // return true or false
//       return TotalAmount <= WalletBalance;
//     }
//     let sufficientBalance = checkSufficientBalance(TotalAmount, req.body.WalletBalance);
//     if (!sufficientBalance) {
//       throw new Error(`Insufficient balance ${req.body.WalletBalance} in wallet`);
//     }
//     if (!SaleOrderDate) {
//       throw new Error("SaleOrderDate is required");
//     } else if (!ModeOfPayment) {
//       throw new Error("ModeOfPayment is required");
//     } else if (!SaleChannel) {
//       throw new Error("SaleChannel is required");
//     } else if (!SalePlatform) {
//       throw new Error("SalePlatform is required");
//     } else if (!PaymentTransactionID) {
//       throw new Error("PaymentTransactionID is required");
//     } else if (!TotalAmount) {
//       throw new Error("TotalAmount is required");
//     }
//     SalesDetails.forEach((saleDetail: any) => {
//       if (!saleDetail.ProductGUID) {
//         throw new Error("ProductGUID is required");
//       } else if (!saleDetail.Qty) {
//         throw new Error("Quantity is required");
//       } else if (!saleDetail.Amount) {
//         throw new Error("Amount is required");
//       }
//     });
//     if (!Array.isArray(SalesDetails)) {
//       throw new Error("SaleDetails should be an array");
//     }
//     const updatedWallet = await UserWallet.create({
//       UserGUID: req.body.CreatedGUID,
//       Debit: TotalAmount,
//       CreatedGUID: req.body.CreatedGUID,
//       TransactionId:generateUniqueNumber()
//     });
//     const sale = await Sale.create(
//       { ...saleData, WalletGUID: updatedWallet.WalletGUID },
//       { transaction }
//     );
//     const saleDetails = await SaleDetail.bulkCreate(
//       SalesDetails.map((saleDetail: any) => ({
//         SalesMasterGUID: sale.SalesMasterGUID,
//         ...saleDetail,
//       })),
//       { transaction }
//     );
//     transaction.commit();
//     res.json({
//       sale,
//       SaleDetails: saleDetails,
//     });
//   } catch (error) {
//     transaction.rollback();
//     next(error);
//   }
// };
