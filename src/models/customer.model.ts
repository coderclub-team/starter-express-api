import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "tbl_Customer",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
    deletedAt: "DeletedDate",
    paranoid: true,
    })
export default class Customer extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  CustomerGUID!: number;
  @Column
  CustomerID!: string;
  @Column
  CustomerName!: string;
  @Column
  Description!: string;
  @Column
  Address!: string;
  @Column
  City!: string;
  @Column
  State!: string;
  @Column
  MobileNo!: string;
  @Column
  EmailID!: string;
  @Column
  ShopID!: string;
  @Column
  CreatedGUID!: string;
  @Column
  CreatedDate!: Date;
  @Column
  GSTNo!: string;
  @Column
  CustomerTypeGUID!: string;
  @Column
  LineCode!: string;
  @Column
  ActiveFrom!: Date;
  @Column
  ActiveTo!: Date;
  @Column
  AppSubscriptionStatus!: string;
  @Column
  IsActive!: boolean;
  @Column
  CustomerType!: string;
  @Column
  SaleRateGUID!: string;
  @Column
  UpdatedDate!: Date;
  @Column
  DeletedDate!: Date;
}
