import {
  BeforeCreate,
  BeforeFind,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductCategory from "./product-category.model";
import ProductSubCategory from "./product-sub-category.model";
import ProductReview from "./product-review.model";
import ProductStockMaster from "./product-stock-master.model";
import { Request } from "express";

@Table({
  tableName: "tbl_ProductMaster",
  timestamps: true,
  paranoid: false,
  createdAt: "CreatedDate",
  updatedAt: "UpdatedAt",

  // deletedAt: "DeletedDate",
})
class ProductMaster extends Model {



  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  ProductGUID!: number;

  @HasMany(() => ProductReview)
  Reviews?: ProductReview;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  ProductID!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  ProductName!: string;
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  ProductCode!: string;

  // ProductCategoryGUID;
  // ProductSubCategoryGUID;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: "Unit_Price",
  })
  UnitPrice!: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: "Sale_Rate",
  })
  SaleRate!: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  MRP!: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  GST!: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  Qty!: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  UnitsInStock!: number;
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  IsActive!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  CreatedDate!: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  SKU!: string;
  @Column
  UOM!: string;
  @Column
  UOMTypeGUID!: string;

  @Column
  PhotoPath!: string;
  @Column
  ProductType!: string;
  @Column
  GalleryPhotoPath1?: string;
  @Column
  GalleryPhotoPath2?: string;
  @Column
  GalleryPhotoPath3?: string;
  @Column
  GalleryPhotoPath4?: string;
  @Column
  ProductDescription!: string;
  @Column
  IsFeatured!: number;
  @Column
  OnSale!: number;
  @Column
  Width?: number;
  @Column
  Height?: number;
  @Column
  Length?: number;
  @Column
  Weight!: number;
  @Column
  ProductSlug!: string;

  @ForeignKey(() => ProductCategory)
  @Column
  ProductCategoryGUID!: number;

  @BelongsTo(() => ProductCategory)
  ProductCategory!: ProductCategory;

  @ForeignKey(() => ProductSubCategory)
  ProductSubCategoryGUID!: number;

  @Column({
    type: DataType.VIRTUAL,
  })
  attributes!: {
    visible?: boolean;
    variation?: boolean;
    name: string;
    options: string[]; // [key: string]: string;];
  }[];

  @Column({
    type: DataType.VIRTUAL,
  })
  Dimensions!: {
    width: number;
    height: number;
    length: number;
  };

  @HasOne(() => ProductStockMaster)
  Stock!: ProductStockMaster;

  @Column({
    type: DataType.VIRTUAL,
  })
  Categories?: {
    name: string;
  }[];

  @BeforeCreate
  static async generateProductGUID(instance: ProductMaster) {
    const nextGUID =
      (((await this.max("ProductGUID")) as null | number) || 0) + 1;

    const productCategory = await ProductCategory.findByPk(
      instance.ProductCategoryGUID
    );
    const productSubCategory = await ProductSubCategory.findByPk(
      instance.ProductSubCategoryGUID
    );
    if (!productCategory || !productSubCategory)
      return (instance.ProductID =
        "ABC-XYZ-" + nextGUID.toString().padStart(4, "0"));
    const PRO = productCategory?.ProductCategoryName.substring(
      0,
      3
    )?.toUpperCase();
    const SUB = productSubCategory?.ProductSubCategoryName.substring(
      0,
      3
    )?.toUpperCase();
    instance.ProductID =
      PRO + "-" + SUB + "-" + nextGUID.toString().padStart(4, "0");
    instance.ProductID =
      "CAT" + "-" + "SUB" + "-" + nextGUID.toString().padStart(4, "0");
    instance.ProductCode = instance.ProductID;
  }

  // Getter method to return an array of image URLs
  get images(): string[] {
    const images = [
      this.getDataValue("GalleryPhotoPath1"),
      this.getDataValue("GalleryPhotoPath2"),
      this.getDataValue("GalleryPhotoPath3"),
      this.getDataValue("GalleryPhotoPath4"),
    ];
    // Remove any null or undefined values
    return images.filter((image) => image);
  }




  setFullURL(request: Request,key: keyof ProductMaster) {
    const hostname= request.protocol + "://" + request.get("host")
    const originalPath= this.getDataValue(key) || "identities/product-identity.png"
    if(!originalPath) return;
     const fullPath = `${hostname}/${originalPath}`;
     this.setDataValue(key, fullPath);
   }



}

export default ProductMaster;
