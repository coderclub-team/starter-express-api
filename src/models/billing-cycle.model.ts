import {
  AutoIncrement,
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import GlobalType from "./global-type.model";
import { Optional } from "sequelize";


interface SubscriptionCycleInterface {
  BillingCycleGUID?: number;
  BillingCycleName: "Daily" | "Monthly";
  NumberOfCycles: number;
  GlobalType?: GlobalType;
  MondayQty?: number;
  TuesdayQty?: number;
  WednesdayQty?: number;
  ThursdayQty?: number;
  FridayQty?: number;
  SaturdayQty?: number;
  SundayQty?: number;
  EveryNthDayInterval?: number;
  EveryNthDayQty?: number;
  ProductGUID?: number;
  UserGUID?: number;
}
export interface SubscriptionCycleCreationAttributes extends Optional<SubscriptionCycleInterface, "BillingCycleGUID"> {}
@Table({
  tableName: "tbl_BillingCycles",
  timestamps: false,
  paranoid: false,

})
class SubscriptionCycle extends Model<SubscriptionCycleInterface, SubscriptionCycleCreationAttributes>{

  @PrimaryKey
  @AutoIncrement
  @Column
  BillingCycleGUID!: number;
  @Column
  BillingCycleName!: "Daily" | "Monthly";
  @Column
  NumberOfCycles!: string;
  // @Column
  // @BelongsTo(() => GlobalType, "BillingCycleType")
  // GlobalType?:GlobalType
  @Column
  MondayQty?: number;
  @Column
  TuesdayQty?: number;
  @Column
  WednesdayQty?: number;
  @Column
  ThursdayQty?: number;
  @Column
  FridayQty?: number;
  @Column
  SaturdayQty?: number;
  @Column
  SundayQty?: number;
  @Column
  EveryNthDayInterval?: number;
  @Column
  EveryNthDayQty?: number;

  @Column
  UserGUID!: number;

  @Column
  ProductGUID!: number;
  // @BelongsTo(() => GlobalType, "BillingCycleType")
  // BillingCycleType?: GlobalType;
}
export default SubscriptionCycle;
