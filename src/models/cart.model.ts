import { AutoIncrement, BelongsTo, ForeignKey, Model, PrimaryKey } from "sequelize-typescript";
import { Column, DataType, Table } from "sequelize-typescript";
import ProductMaster from "./product-master.model";
import SubscriptionCycle from "./billing-cycle.model";
import User from "./user.model";
import ProductSubscription from "./product-subscription.model";

@Table({
  tableName: "tbl_Cart",
  timestamps: true,
  paranoid: false,
  createdAt:"CreatedDate",
  updatedAt:false,

})
export default class Cart extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    CartGUID!: number;
  

  @ForeignKey(() => ProductMaster)
  ProductGUID!: number;
  @BelongsTo(() => ProductMaster)
  Product!: ProductMaster;



  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Quantity!: number;

  @ForeignKey(() => User)
  @Column
  CreatedGUID!: number;

  @Column
  CreatedDate!: Date;

  @Column
  IsSubscription!: number;

  @ForeignKey(() => SubscriptionCycle)
  @Column
  SubsCycleGUID!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  SubsOccurences!: number;

  
}
