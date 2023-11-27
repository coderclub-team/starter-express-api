import {
  AfterCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Sequelize,
  Table,
} from "sequelize-typescript";
import Message from "../entities/message.class";
import User from "./user.model";
// import UserWalletBalance from "./user-wallet-balance.model";
import ProductSubscription from "./product-subscription.model";
import Sale from "./sale.model";
import { Transaction, VIRTUAL } from "sequelize";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: "tbl_UserWallets",
  createdAt: "CreatedDate",
  updatedAt: "UpdatedDate",
  deletedAt: "DeletedDate",
  hasTrigger: true,
})
export default class UserWallet extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  WalletGUID!: number;

  @ForeignKey(()=>User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  UserGUID!: number;

  @BelongsTo(()=>User)
  User!:User

  @Column
  Description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  Credit!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  Debit!: number;



  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  CreatedDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  })
  UpdatedDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  DeletedDate!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  CreatedGUID!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  UpdatedGUID!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  DeletedGUID!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: "FULLFILLED",
  })
  Status!: string;
  @Column
  PaymentId!: string;

  @Column
  TransactionId!:string

  // @ForeignKey(() => Sale)
  // @Column
  // SalesMasterGUID!: number;

  // @BelongsTo(() => Sale)
  // Order!: Sale;

  // @ForeignKey(() => ProductSubscription)
  // @Column
  // SubscriptionGUID!: number;

  // @BelongsTo(() => ProductSubscription)
  // Subscription!: ProductSubscription;


  @AfterCreate
  static async updateBalance(instance: UserWallet,options:{
    transaction:Transaction
  }) {
    const user = await User.findByPk(instance.getDataValue("UserGUID"),{
      transaction:options.transaction
    });
    const balance = await UserWallet.findOne({
      where: { UserGUID: instance.getDataValue("UserGUID") },
      order: [["WalletGUID", "DESC"]],
      transaction:options.transaction
    });
    if (instance.getDataValue("Credit") > 0) {
      Message.sendRechargeSuccessMessage({
        MobileNo: user?.getDataValue("MobileNo"),
        RechargeAmount: instance.getDataValue("Credit"),
        RechargeDate: instance.getDataValue("CreatedDate") as Date,
        Balance: balance?.getDataValue("Balance"),
        DigitalCard: user?.DigitalCard!,
      })
       
    }
  }

 @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
     get() {
      const prefix = this.getDataValue("Credit") > 0 ? "PT-" : "CL-";
        return `${prefix}${new Date(this.getDataValue("CreatedDate")).getTime()}`
     },
 })
 VoucherNo!: string;

  @HasOne(() => Sale, {
    foreignKey: 'WalletGUID',
  })
  Sale!: UserWallet;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue("Credit") > 0 ? "RECEIPT" : "INVOICE";
    },
  })
  VoucherType!: string;

  @HasOne(() => ProductSubscription, {
    foreignKey: 'WalletGUID',
  })
  Subscription!: UserWallet;

  @Column
  Balance!: number;
}
