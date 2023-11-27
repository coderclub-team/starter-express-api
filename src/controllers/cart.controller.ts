import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import ProductMaster from "../models/product-master.model";
import SubscriptionCycle from "../models/billing-cycle.model";
import { Op } from "sequelize";
import GlobalType from "../models/global-type.model";
import { sequelize } from "../database";
import UserWallet from "../models/user-wallet.model";
import ProductSubscription from "../models/product-subscription.model";
import Sale from "../models/sale.model";
import {
  generateUniqueNumber,
  getCartTotal,
  numberToCurrency,
  promocodeValidator,
} from "../functions";
import SaleDetail from "../models/sale-detail.model";
const addSubsToCart = async (req: Request, res: Response) => {
  const {
    ProductGUID,
    Quantity,
    IsSubscription = 1,
    SubsCycleGUID,
    SubsOccurences = 1,
    user,
  } = req.body;

  try {
    const product = ProductMaster.findByPk(ProductGUID);
    if (!product) {
      throw new Error("Product not found");
    }
    const subscriptionCycle = await SubscriptionCycle.findByPk(SubsCycleGUID);
    if (!subscriptionCycle) {
      throw new Error("Subscription cycle not found");
    }

    const cart = await Cart.findOne({
      where: {
        ProductGUID,
        CreatedGUID: user.UserGUID,
        IsSubscription: {
          [Op.eq]: 1,
        },
      },
    });
    if (cart) {
      return res.status(400).json({
        message: "Subscription already added to cart",
      });
    }
    const newCart = await Cart.create({
      ProductGUID,
      Quantity: 1,
      CreatedGUID: user.UserGUID,
      IsSubscription: 1,
      SubsCycleGUID,
      SubsOccurences,
    });
    return res.status(200).json({
      message: "Cart updated successfully",
      cart: newCart,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const removeSubsFromCart = async (req: Request, res: Response) => {
  const {
    ProductGUID,
    Quantity,
    IsSubscription,
    SubsCycleGUID,
    SubsOccurences,
    user,
  } = req.body;

  try {
    const cart = await Cart.findOne({
      where: {
        ProductGUID,
        CreatedGUID: {
          [Op.eq]: [user.UserGUID],
        },
        IsSubscription: {
          [Op.eq]: 1,
        },
        SubsCycleGUID: {
          [Op.eq]: SubsCycleGUID,
        },
        SubsOccurences: {
          [Op.eq]: SubsOccurences,
        },
      },
    });
    if (!cart) {
      throw new Error("Cart not found");
    }
    await cart.destroy();
    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

// *************
// *************
// *************
// *************

export const getCart = async (req: Request, res: Response) => {
  const { user } = req.body;

  try {
    const sales = await Cart.findAll({
      where: {
        CreatedGUID: user.UserGUID,
        IsSubscription: 0,
      },
      include: [ProductMaster],
    });

    const subscriptions = await Cart.findAll({
      where: {
        CreatedGUID: user.UserGUID,
        IsSubscription: 1,
      },
      include: [ProductMaster],
    });
    const CartTotal = await getCartTotal({
      sales,
      subscriptions,
    });
    return res.status(200).json({
      Message: "Cart fetched successfully",
      Cart: [...sales, ...subscriptions],
      CartTotal: numberToCurrency(CartTotal),
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { ProductGUID, Quantity, IsSubscription, user } = req.body;

  if (IsSubscription) {
    return addSubsToCart(req, res);
  } else {
    try {
      const product = ProductMaster.findByPk(ProductGUID);
      if (!product) {
        throw new Error("Product not found");
      }

      const cart = await Cart.findOne({
        where: {
          ProductGUID,
          CreatedGUID: user.UserGUID,
        },
      });



      if (cart) {
        cart.Quantity += Quantity;
        await cart.save();
        return res.status(200).json({
          message: "Cart updated successfully",
          cart,
        });
      }
     
      const newCart = await Cart.create({
        ProductGUID,
        Quantity,
        UserGUID: user.UserGUID,
        CreatedGUID: user.UserGUID,
      });
      return res.status(200).json({
        message: "Cart updated successfully",
        cart: newCart,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({
        message: error.message,
      });
    }
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { ProductGUID, Quantity, IsSubscription, user } = req.body;

  if (IsSubscription) {
    return removeSubsFromCart(req, res);
  } else {
    try {
      const cart = await Cart.findOne({
        where: {
          ProductGUID: {
            [Op.eq]: ProductGUID,
          },
          CreatedGUID: {
            [Op.eq]: [user.UserGUID],
          },
          IsSubscription: {
            [Op.ne]: 0,
          },
        },
      });
      if (!cart) {
        throw new Error("Cart not found");
      }

      if (Quantity >= cart.Quantity) {
        await cart.destroy();
        return res.status(200).json({
          message: "Cart deleted successfully",
        });
      } else {
        cart.Quantity -= Quantity;
      }

      await cart.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({
        message: error.message,
      });
    }
  }
};

export const moveFromCartToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    user,
    PaymentMode = "Wallet",
    WalletBalance,
    PaymentTransactionID,
    PromoCode,
    SaleType = 69,
    promotion,
  } = req.body;
  const SalePlatform = req.useragent?.platform;
  const t = await sequelize.transaction({
    autocommit: false,
  
  });
  try {
    const sales = await Cart.findAll({
      where: {
        CreatedGUID: user.UserGUID,
        IsSubscription: 0,
      },
      include: [ProductMaster],
    });

    const subscriptions = await Cart.findAll({
      where: {
        CreatedGUID: user.UserGUID,
        IsSubscription: 1,
      },
      include: [ProductMaster],
    });
    if (sales.length == 0 && subscriptions.length == 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (PaymentMode == "Wallet") {
      const GT = await GlobalType.findOne({
        where: {
          GlobalTypeName: {
            [Op.eq]: PaymentMode,
          },
        },
      });
      const CartGrossTotal = await getCartTotal({
        sales,
        subscriptions,
      });

      if (CartGrossTotal > WalletBalance) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }

      const p = PromoCode
        ? await promocodeValidator({
            CartGrossTotal: CartGrossTotal,
            PromoCode,
            CreatedGUID: user.UserGUID,
          })
        : undefined;

      const wallet = await UserWallet.create({
        UserGUID: user.UserGUID,
        Debit: CartGrossTotal,
        CreatedGUID: user.UserGUID,
        Description: "Order Placed",
        PaymentId:generateUniqueNumber(),
        TransactionId:generateUniqueNumber(),
        CreatedDate: new Date(),
      },{
        transaction:t
      });

      const salesData = await Sale.create(
        {
          SaleType,
          StoreGUID: user.StoreGUID,
          CreatedGUID: user.StoreGUID,
          CustomerGUID: user.StoreGUID,
          SaleOrderDate: new Date(),
          SalePlatform,
          PaymentMode: GT?.getDataValue("GlobalTypeGUID"),
          PromotionGUID: promotion?.getDataValue("PromotionGUID"),
          PaymentTransactionID: wallet.getDataValue("WalletGUID"),

          Status: "PLACED",

          // PaymentTransactionID,
          GrossTotal: CartGrossTotal,
          TotalAmount:
            p?.Type === "PERCENTAGE"
              ? CartGrossTotal * (p?.Value / 100)
              : p?.Type == "FIXED"
              ? CartGrossTotal - p?.Value
              : CartGrossTotal,
        },
        {
          transaction: t,
        }
      );
      const sale_details = sales.map((cart) => ({
        ProductGUID: cart.getDataValue("ProductGUID"),
        Quantity: cart.getDataValue('Quantity'),
        SaleMasterGUID: salesData.getDataValue("SalesMasterGUID"),
      }));

      const subscriptionsData = subscriptions?.map((cart) => ({
        UserGUID: user.UserGUID,
        SalesMasterGUID: salesData?.getDataValue('SalesMasterGUID'),
        ProductGUID: cart?.getDataValue("ProductGUID"),
        SubscriptionStartDate: new Date(),
        SubscriptionEndDate: new Date(),
        SubscriptionOccurrences: cart.getDataValue("SubsOccurences"),
        PaymentTransactionId: generateUniqueNumber(),
        SubscriptionPrice: cart.Product.getDataValue("SaleRate"),
        BillingCycleGUID: cart.getDataValue('SubsCycleGUID'),
      }));

      const sales_details_records = await SaleDetail.bulkCreate(sale_details, {
        transaction: t,
      });

      const subscription_records = await ProductSubscription.bulkCreate(
        subscriptionsData,
        {
          transaction: t,
        }
      );
      await Cart.destroy({
        where: {
          CreatedGUID: {
            [Op.eq]: user.UserGUID,
          },
        },
        transaction: t,
      });
      await t.commit()
      return res.status(200).json({
        message: "Order placed successfully",
        salesData,
        sales_details_records,
        subscription_records,
      });
    }
  } catch (error) {
    t.rollback();

    next(error);
  }
};

