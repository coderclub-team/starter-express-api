import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import ProductCategory from "./product-category.model";

@Table({
  tableName: "tbl_ProductSubCategory",
  timestamps: false,
  paranoid: false,
})
export default class ProductSubCategory extends Model<ProductSubCategory> {
  @Column({
    field: "ProductSubCategoryGUID",
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataType.INTEGER,
  })
  ProductSubCategoryGUID!: number;

  @BelongsTo(() => ProductCategory, {
    foreignKey: "ProductCategoryGUID",
    targetKey: "ProductCategoryGUID",
    as: "Parent",
  })
  @Column({
    field: "ProductCategoryGUID",
    allowNull: false,
    type: DataType.INTEGER,
    comment: "Product Category GUID",
  })
  ProductCategoryGUID!: number;

  @Column({
    field: "ProductSubCategoryName",
    allowNull: false,
    type: DataType.STRING(100),
    comment: "Product Sub Category Name",
    unique: true,
  })
  ProductSubCategoryName!: string;

  @Column({
    field: "IsActive",
    allowNull: false,
    type: DataType.BOOLEAN,
    comment: "Is Active",
    defaultValue: 1,
  })
  IsActive!: number;

  @Column({
    field: "CreatedDate",
    allowNull: false,
    type: DataType.DATE,
  })
  CreatedDate!: Date;
}
