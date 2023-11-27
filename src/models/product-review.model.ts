// tbl_ProductReviews model

import {
  AutoIncrement,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductMaster from "./product-master.model";
import User from "./user.model";


// ReviewGUID;
// Review;
// ProductGUID;
// CreatedUserGUID;
// CreatedDate;

@Table({
  tableName: "tbl_ProductReviews",
  timestamps: false,
})
class ProductReview extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  ReviewGUID?: string;

  @Column
  @ForeignKey(() => ProductMaster)
  ProductGUID?: string;

  @Column
  @ForeignKey(() => User)
  CreatedUserGUID?: string;

  @BelongsTo(() => User)
  User!: User;

  @Column
  CreatedDate?: Date;
  // @Column
  // Status: "Active" | "Deactived" | "Pending" | "Blocked" = "Active";

  @Column
  Review?: string;

  @Column({
    type: DataType.DECIMAL(1,2),
  })
  Rating!: number;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: ProductReview[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof ProductReview, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: ProductReview) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof ProductReview, value.trim());
      }
    });
  }
}

export default ProductReview;
