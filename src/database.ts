import { Sequelize } from "sequelize-typescript";
import { sequelizeConnectionOptions } from "../config";
import ProductMaster from "./models/product-master.model";
import User from "./models/user.model";
import ProductCategory from "./models/product-category.model";
import ProductSubCategory from "./models/product-sub-category.model";
import Sale from "./models/sale.model";
import SaleDetail from "./models/sale-detail.model";
import GlobalType from "./models/global-type.model";
import GlobalTypeCategory from "./models/global-type-category.nodel";
import ProductReview from "./models/product-review.model";
import UserAddress from "./models/user-address.model";
import CartItem from "./models/cart-item";
import ProductSubscription from "./models/product-subscription.model";
import SubscriptionCycles from "./models/billing-cycle.model";
import ProductStockMaster from "./models/product-stock-master.model";
import UserWallet from "./models/user-wallet.model";
import UserWalletBalance from "./models/user-wallet-balance.model";
import { Promotion } from "./models/promotion.model";
import { Banner, ContactForm, FAQ, Walkthrough } from "./models/cms.model";
import Cart from "./models/cart.model";
import Lineman from "./models/lineman.model";
import Customer from "./models/customer.model";
import StoreMaster from "./models/store-master.model";
import { Route } from "./models/route.model";

export const sequelize = new Sequelize(sequelizeConnectionOptions);

export default async () => {
  sequelize
    .authenticate({
      logging: console.log,
      plain: true,
      raw: true,
    })
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  sequelize.addModels([
    User,
    ProductCategory,
    ProductSubCategory,
    ProductMaster,
    GlobalTypeCategory,
    GlobalType,

    Sale,
    SaleDetail,
    ProductReview,
    UserAddress,
    CartItem,
    SubscriptionCycles,
    ProductSubscription,
    ProductStockMaster,
    UserWallet,
    UserWalletBalance,
    Promotion,
    Walkthrough,
    Banner,
    FAQ,
    ContactForm,
    Cart,
    Lineman,
    Customer,
    StoreMaster,
    Route
 
  ]);
  // return sequelize;
};
