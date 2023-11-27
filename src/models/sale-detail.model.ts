import {
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
import Sale from "./sale.model";
import ProductMaster from "./product-master.model";
import { Request } from "express";

@Table({
  tableName: "tbl_SalesDetails",
  timestamps: false,
  paranoid: false,
})
export default class SaleDetail extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    autoIncrementIdentity: true,
  })
  SalesDetailGUID!: number;

  @ForeignKey(() => Sale)
  @Column
  SalesMasterGUID!: number;

  @BelongsTo(() => Sale)
  SalesMasterRef?: Sale;

  @ForeignKey(() => ProductMaster)
  @Column
  ProductGUID!: number;

  @BelongsTo(() => ProductMaster)
  Product!: ProductMaster;



  // @Column
  // ProductName!: string;

  // @Column
  // ProductCode!: string;
  @Column
  Qty!: number;
  // @Column
  // MRP!: number;
  @Column
  SaleRate!: number;
  // @Column
  // SGST!: number;
  // @Column
  // CGST!: number;
  // @Column
  // DiscountPercent!: number;
  // @Column
  // DiscAmt!: number;
  // @Column
  // TaxAmount!: number;
  // @Column
  // Amount!: number;
  // @Column
  // CreatedGUID!: number;
  // @Column
  // CreatedDate!: Date;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: SaleDetail[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof SaleDetail, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: SaleDetail) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof SaleDetail, value.trim());
      }
    });
  }



}

// EXEC sp_help tbl_SalesDetails

// SalesDetailGUID
// SalesMasterGUID
// ProductGUID
// ProductCode
// Qty
// MRP
// SaleRate
// SGST
// CGST
// DiscountPercent
// DiscAmt
// TaxAmount
// Amount
// CreatedGUID
// CreatedDate
