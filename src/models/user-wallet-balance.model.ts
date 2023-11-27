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
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import UserWallet from "./user-wallet.model";

@Table({
  tableName: "tbl_UserWalletBalances",
  timestamps: false,
  paranoid: false,
})
export default class UserWalletBalance extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  WalletBalanceGUID!: number;

  @ForeignKey(() => User)
  @Column
  UserGUID!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  Balance!: number;
  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: UserWallet[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof UserWallet, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: UserWallet) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof UserWallet, value.trim());
      }
    });
  }

}
