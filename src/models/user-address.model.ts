import { BeforeBulkCreate, BeforeBulkUpdate, BeforeCreate, BeforeUpdate, Model, Table } from "sequelize-typescript";
import {
  AutoIncrement,
  Column,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import User from "./user.model";

@Table({
  tableName: "tbl_UserAddresses",
  timestamps: true,
  paranoid: false,
  createdAt: "CreatedDate",
  updatedAt: "UpdatedDate",
  deletedAt: "DeletedDate",
})
class UserAddress extends Model<UserAddress> {
  @PrimaryKey
  @AutoIncrement
  @Column
  AddressGUID?: string;

  @Column
  HouseNo?: string;
  @Column
  Locality?: string;

  @Column
  Landmark?: string;
  @Column
  Country?: string;
  @Column
  CreatedGUID?: string;

  @Column
  StreetName?: string;

  @Column
  @ForeignKey(() => User)
  UserGUID?: string;
  @Column
  City?: string;
  @Column
  State?: string;
  @Column
  Pincode?: string;

  @Column
  CreatedDate?: Date;
  @Column
  UpdatedDate?: Date;
  @Column
  DeletedDate?: Date;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: User[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof User, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: User) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof User, value.trim());
      }
    });
  }

}

export default UserAddress;
