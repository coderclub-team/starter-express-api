import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductMaster from "./product-master.model";
type StringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type ProductVariantStringProperties = StringProperties<ProductVariant>;

@Table({
  tableName: "tbl_ProductVariant",
  timestamps: true,
  paranoid: false,
  createdAt: "CreatedDate",
  updatedAt: "ModifiedDate",
  deletedAt: "DeletedDate",
})
export class ProductVariant extends Model<ProductVariant> {
  @PrimaryKey
  @AutoIncrement
  @Column
  ProductVariantGUID!: number;
  @Column
  Unit_Price!: number;
  @Column
  MRP!: number;
  @Column
  GST!: number;
  @Column
  Qty!: number;
  @Column
  UnitsInStock!: number;
  @Column
  IsActive!: boolean;
  @Column
  SKU!: string;
  @Column
  UOM!: string;
  @Column
  Weight!: number;
  @Column
  Length!: number;
  @Column
  Width!: number;
  @Column
  Height!: number;
  @Column
  SaleRate!: number;

  @ForeignKey(() => ProductMaster)
  @Column
  ProductMasterRefGUID!: number;

  @Column
  Size!: string;

  @Column
  Color!: string;

  @Column
  Flavour!: string;

  @Column
  Featured!: boolean;

  @Column
  CreatedGUID!: number;

  // Define the virtual field as a getter method that returns an object with the dimensions
  get dimensions(): { width: number; height: number; length: number } {
    return {
      width: this.Width,
      height: this.Height,
      length: this.Length,
    };
  }

}
