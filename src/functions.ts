

export function omitUndefined<T>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== undefined
    ) {
      result[key] = obj[key];
    }
  }

  return result;
}

export const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);


export function formatDateIndianStyle(date:Date) {
  const options:Intl.DateTimeFormatOptions  = { year:"numeric", month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}




import { Promotion } from "./models/promotion.model";
import Sale from "./models/sale.model";
import ProductSubscription from "./models/product-subscription.model";
import Cart from "./models/cart.model";
import { Op } from "sequelize";
import { MyWhereType } from "..";

export const promocodeValidator = async ({
  PromoCode,
  CartGrossTotal,
  CreatedGUID,
}:{
  PromoCode:String,
  CartGrossTotal:number,
  CreatedGUID:String
}) => {
  return new Promise<Promotion>(async (resolve, reject) => {




    const promotion = await Promotion.findOne({
      where: {
        PromoCode: {
          [Op.eq]: PromoCode,
        },
        DeletedDate: {
          [Op.eq]: null,
        },
        MaxOrderTotal: {
          [Op.gte]: CartGrossTotal,
        },
        CurrentStock: {
          [Op.gt]: 0,
        },
        Status: {
          [Op.eq]: "ACTIVE",
        },
      },
    });

    if(!promotion){
      return reject("Invalid Promo Code")
    }

    const count_used = await Sale.count({
      where: {
        PromotionGUID: {
          [Op.eq]: promotion?.PromotionGUID,
        },
        CreatedGUID: {
          [Op.eq]: CreatedGUID,
        },
      },
    });
  
    if (count_used >= promotion.UsageLimit) {
      return reject("Promo code usage limit reached");
    }





   return resolve(promotion);
  });

};


export const  getCartTotal = async (props:{
  sales:Cart[],subscriptions?:Cart[]
}) => {
  
  const saleGrossTotal = props.sales?.reduce(
    (acc, cart) => acc + cart.Product.SaleRate * cart.Quantity,
    0
  );
  const subsGrossTotal = props?.subscriptions?.reduce((acc, cart) => {
    return acc + cart.Product.SaleRate * cart.SubsOccurences;
  }, 0);

  const CartGrossTotal = (saleGrossTotal||0) + (subsGrossTotal || 0);

  return CartGrossTotal

}

export const numberToCurrency=(number:number)=>{
    const formattedNumber = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(number);

  return  formattedNumber
}
export function generateUniqueNumber(length?:number) {
  // Generate a random 6-digit number
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  // Ensure the number is exactly 6 digits long
  const uniqueNumber = String(randomNumber).slice(0, length || 6);

  return uniqueNumber;
}

export function capitalizeEveryWord(sentence:string) {
  return sentence
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}
