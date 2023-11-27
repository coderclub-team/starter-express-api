import {
    BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductMaster from "./product-master.model";
import StoreMaster from "./store-master.model";
@Table({
  tableName: "tbl_ProductRateMaster",
  timestamps: false,
  paranoid: false,
})
export  default class ProductStockMaster extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true, type: DataType.INTEGER })
  ProductRateMasterGUID!: number;

  @ForeignKey(() => StoreMaster)
  @Column({ type: DataType.INTEGER })
  StoreGUID!: number;

  @ForeignKey(() => ProductMaster)
  @Column({ type: DataType.INTEGER })
  ProductGUID!: number;
  Sale_Rate1!: number;
  @Column({ type: DataType.INTEGER })
  Sale_Rate2!: number;
  @Column({ type: DataType.INTEGER })
  Sale_Rate3!: number;
  @Column({ type: DataType.INTEGER })
  Sale_Rate4!: number;
  @Column({ type: DataType.INTEGER })
  Sale_Rate5!: number;
  @Column({ type: DataType.INTEGER })
  CreatedGUID!: number;
  @Column({ type: DataType.DATE })
  CreatedDate!: Date;
  @Column({ type: DataType.INTEGER })
  UnitsInStock!: number;


}

