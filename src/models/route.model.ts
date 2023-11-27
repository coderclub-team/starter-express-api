
import { Model, Column, Table, DataType, ForeignKey, BelongsToMany, HasMany } from "sequelize-typescript";
import StoreMaster from "./store-master.model";
import User from "./user.model";

@Table({ tableName: "tbl_Routes",
createdAt: "CreatedDate",
updatedAt: "UpdatedDate",
deletedAt: "DeletedDate",
 })
export class Route extends Model<Route> {
    @Column({ primaryKey: true, autoIncrement: true })
    RouteGUID!: number;

    @Column({ allowNull: false })
    Name!: string;

    @Column(DataType.TEXT)
    Description?: string;

    @Column({ allowNull: false })
    StartingLocation!: string;

    @Column({ allowNull: false })
    EndingLocation!: string;

    @Column(DataType.DECIMAL(9, 6))
    StartingLocationLatitude?: number;

    @Column(DataType.DECIMAL(9, 6))
    StartingLocationLongitude?: number;

    @Column(DataType.DECIMAL(9, 6))
    EndingLocationLatitude?: number;

    @Column(DataType.DECIMAL(9, 6))
    EndingLocationLongitude?: number;

    @Column(DataType.TEXT)
    Notes?: string;

    @Column({ allowNull: false, defaultValue: 1 })
    Status!: number;

    @Column(DataType.DATE)
    CreatedDate?: Date;

    @Column(DataType.DATE)
    UpdatedDate?: Date;



    @HasMany(() => User)
    Users!: User[];
   

    @Column(DataType.DATE)
    DeletedDate?: Date;
    @ForeignKey(() => StoreMaster)
    @Column({ allowNull: false })
    StoreGUID!: number;
}
    

