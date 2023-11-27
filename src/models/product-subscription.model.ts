import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import ProductMaster from "./product-master.model";
import User from "./user.model";
import BillingCycles from "./billing-cycle.model";
import { Promotion } from "./promotion.model";
import { Optional } from "sequelize";


// interface SubscriptionCycleInterface {
//   BillingCycleGUID?: number;
//   BillingCycleName: "Daily" | "Monthly";
//   NumberOfCycles: number;
//   GlobalType?: GlobalType;
//   MondayQty?: number;
//   TuesdayQty?: number;
//   WednesdayQty?: number;
//   ThursdayQty?: number;
//   FridayQty?: number;
//   SaturdayQty?: number;
//   SundayQty?: number;
//   EveryNthDayInterval?: number;
//   EveryNthDayQty?: number;
//   ProductGUID?: number;
//   UserGUID?: number;
// }
// export interface SubscriptionCycleCreationAttributes extends Optional<SubscriptionCycleInterface, "BillingCycleGUID"> {}
// --  LastPaymentDate: new Date(),
// --           NextPaymentDate: new Date(),
// --           PaymentMethod: "CASH",
// --           PaymentTransactionId: "344",

interface ProductSubscriptionInterface {
  SubscriptionGUID?: number;
  UserGUID?: number;
  ProductGUID?: number;
  SubscriptionStartDate?: Date;
  SubscriptionEndDate?: Date;
  SubscriptionOccurrences?: number;
  PromotionGUID?: number;
  BillingCycleGUID?: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
  DeletedDate?: Date;
  CreatedGUID?: number;
  UpdatedGUID?: number;
  DeletedGUID?: number;
  SalesMasterGUID?: number;
  Status?: string;
}

export interface ProductSubscriptionCreationAttributes extends Optional<ProductSubscriptionInterface, "SubscriptionGUID"> {}



@Table({
  tableName: "tbl_ProductSubscriptions",
  createdAt: "CreatedDate",
  updatedAt: "UpdatedDate",
  deletedAt: "DeletedDate",
})

class ProductSubscription extends Model<ProductSubscriptionInterface,ProductSubscriptionCreationAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  SubscriptionGUID!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  UserGUID!: number;

  @BelongsTo(() => User)
  User!: User;

  @ForeignKey(() => ProductMaster)
  @Column(DataType.INTEGER)
  ProductGUID!: number;

  @BelongsTo(() => ProductMaster)
  Product!: ProductMaster;

  @Column(DataType.DATE)
  SubscriptionStartDate!: Date;

  @Column(DataType.DATE)
  SubscriptionEndDate!: Date;

  @Column
  SubscriptionOccurrences!: number;

  @ForeignKey(() => Promotion)
  @Column({
    type: DataType.NUMBER,
    
  })
  PromotionGUID!: number;

  @BelongsTo(() => Promotion)
  Promotion?: Promotion;

  @ForeignKey(() => BillingCycles)
  @Column
  BillingCycleGUID!: number;

  // 'Prepaid Cards'
  // OR
  // 'Cheque Payment'
  // OR
  // 'Bank Transfer'
  // OR 'AEPS'
  // OR 'BHIM'
  // OR 'EMI'
  // OR 'Cash on Delivery'
  // OR 'IMPS'
  // OR 'RTGS'
  // OR 'NEFT'
  // OR 'Mobile Wallets'
  // OR 'UPI'
  // OR 'Net Banking'
  // OR 'Debit Card'


  @Column(DataType.DATE)
  CreatedDate!: Date;

  @Column(DataType.DATE)
  UpdatedDate!: Date;

  @Column(DataType.DATE)
  DeletedDate!: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  CreatedGUID!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  UpdatedGUID!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  DeletedGUID!: number;

  // ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING', 'SUSPENDED', 'TRIAL','PLACED'))  @Column(DataType.STRING(20))
  

  @ForeignKey(() => User)
  @Column
  SalesMasterGUID!: number;
  @Column
  Status!: string;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: ProductSubscription[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof ProductSubscriptionInterface, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: ProductSubscription) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof ProductSubscriptionInterface, value.trim());
      }
    });
  }

  
}

export default ProductSubscription;
