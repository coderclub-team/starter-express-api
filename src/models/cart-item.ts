import {
  AutoIncrement,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductMaster from "./product-master.model";
import User from "./user.model";
import SubscriptionCycle from "./billing-cycle.model";


@Table({
  tableName: "tbl_CartItems",
  timestamps: false,
  paranoid: false,
})
class CartItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  CartItemGUID?: number;

  @ForeignKey(() => ProductMaster)
  @Column
  ProductGUID?: number;

  @Column
  Quantity?: number;

  @Column
  @ForeignKey(() => User)
  CreatedGUID?: number;

  @Column
  CreatedDate?: Date;

  @BelongsTo(() => ProductMaster)
  Product?: ProductMaster;


@Column
isSubscription?: boolean;

@ForeignKey(() => SubscriptionCycle)
@Column
SubsCycleGUID?: number;

@Column
SubsOccurences?: number;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: CartItem[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof CartItem, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: CartItem) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof CartItem, value.trim());
      }
    });
  }

}

export default CartItem;
