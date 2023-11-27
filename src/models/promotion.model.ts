// -- PromotionGUID
// -- Name
// -- Description
// -- MinOrderQty
// -- MaxOrderQty
// -- MinOrderTotal
// -- PromoCode
// -- StartDate
// -- EndDate
// -- IsActive
// -- Type
// -- Value
// -- CreatedDate
// -- UpdatedDate
// -- Stock
// -- CurrentStock
// -- UsageLimit
// -- MaxOrderTotal
// -- DeletedDate
// --MinHistoryRows
// --MaxHistoryRows

import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "tbl_Promotions",
    timestamps: true,
    paranoid: true,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
    deletedAt: "DeletedDate",
})
export class Promotion extends Model {
    @PrimaryKey
    @Column
    PromotionGUID!: number;

    @Column
    Name!: string;

    @Column
    Description!: string;

    @Column
    MinOrderQty!: number;

    @Column
    MaxOrderQty!: number;

    @Column
    MinOrderTotal!: number;

    @Column
    PromoCode!: string;

    @Column
    StartDate!: Date;

    @Column
    EndDate!: Date;

    @Column
    Status!:string;

    @Column
    Type!: string;
    // ([Type]='FREE SHIPPING' OR [Type]='FIXED' OR [Type]='PERCENTAGE')

    @Column
    Value!: number;

    @Column
    CreatedDate!: Date;

    @Column
    UpdatedDate!: Date;

    @Column
    Stock!: number;

    @Column
    CurrentStock!: number;

    @Column
    UsageLimit!: number;

    @Column
    MaxOrderTotal!: number;

    @Column
    DeletedDate!: Date;

    @Column
    MinHistoryRows!: number;

    @Column
    MaxHistoryRows!: number;
}

    

    

