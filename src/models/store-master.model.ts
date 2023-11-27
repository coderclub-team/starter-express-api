import { BelongsTo, Column, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "tbl_StoreMaster",
  timestamps: true,
  createdAt: "CreatedDate",
  updatedAt: "ModifiedDate",
  deletedAt: "DeletedDate",
  paranoid: true,
})
export default class StoreMaster extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "StoreGUID",
  })
  StoreGUID!: number;

  @Column({
    field: "StoreID",
    unique: true,
  })
  StoreID!: string;

  @Column({
    field: "StoreName",
    allowNull: false,
  })
  StoreName!: string;
  @Column({
    field: "Phone",
    allowNull: true,
  })
  Phone!: string;
  @Column({
    field: "Email",
    allowNull: true,
  })
  Email!: string;

  @Column({
    field: "Address",
    allowNull: true,
  })
  Address!: string;
  @Column({
    field: "City",
    allowNull: true,
  })
  City!: string;
  @Column({
    field: "State",
    allowNull: true,
  })
  State!: string;

  @Column({
    field: "PinCode",
    allowNull: true,
  })
  PinCode!: string;
  @Column({
    field: "GSTNO",
    allowNull: true,
  })
  GSTNO!: string;

  @Column({
    field: "CreatedDate",
    allowNull: false,
  })
  CreatedDate!: Date;

  @Column({
    field: "ModifiedDate",
    allowNull: true,
  })
  ModifiedDate!: Date;
  @Column({
    field: "DeletedDate",
    allowNull: true,
  })
  DeletedDate!: Date;

  // @BelongsTo(() => User, "UserGUID")
  // @Column({
  //   field: "CreatedGUID",
  //   allowNull: false,
  // })
  // CreatedGUID!: number;

  // @BelongsTo(() => User, "UserGUID")
  // @Column({
  //   field: "ModifiedGUID",
  //   allowNull: true,
  // })
  // ModifiedGUID!: number;

  // @BelongsTo(() => User, "UserGUID")
  // @Column({
  //   field: "DeletedGUID",
  //   allowNull: true,
  // })
  // DeletedGUID!: number;
}
