import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "tbl_GlobalTypeCategory",
})
export default class GlobalTypeCategory extends Model<GlobalTypeCategory> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
  })
  GlobalTypeCategoryGUID!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  GlobalTypeCategory!: string;
  @Column
  Description!: string;
  @Column
  CreatedGUID!: number;
  @Column
  CreatedDate!: Date;
  @Column
  IsActive!: number;
}
