import { Model, Column, DataType, Table, PrimaryKey } from "sequelize-typescript";
require("dotenv").config();

@Table({
  tableName: "tbl_Walkthrough",
  timestamps: false,
})
export class Walkthrough extends Model<Walkthrough> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  WalkthroughGUID!: number;

  // Uncomment the following lines to add more columns
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: "Title",
  })
  title!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: "Description",
  })
  description!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "PhotoPath",
    get() {
      const baseURL =
        process.env.NODE_ENV == "production"
          ? process.env.STATIC_FILE_URL
          : "http://localhost:3000";
      const path = this.getDataValue("image");
      return baseURL + "/" + path;
    },
  })
  image!: string;

  @Column
  SortOrder!: number;
}


// Path: src/models/cms.model.ts
@Table({
    tableName: "tbl_Banners",
    timestamps: false,
  })
export class Banner extends Model<Banner>{
    @PrimaryKey
    @Column
    BannerGUID!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        field: "Title",
    })
    title!: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: true,
        field: "Description",
    })
    description!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: "PhotoPath",
        get() {
            const baseURL =
              process.env.NODE_ENV == "production"
                ? process.env.STATIC_FILE_URL
                : "http://localhost:3000";
            const path = this.getDataValue("image") as string;
            return baseURL + "/" + path;
          },
    })
    image!: string;

}


@Table({
  tableName: "tbl_FAQ",
  timestamps: false,
})
export class FAQ extends Model<FAQ> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  GUID!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  Question!: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  Answer!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "SortOrder",
  })
  sortOrder!: number;
}

// CREATE TABLE ContactForm (
//   GUID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
//   Name VARCHAR(255) NOT NULL,
//   Email VARCHAR(255) NOT NULL,
//   Message VARCHAR(1000) NOT NULL,
//   CreatedOn DATETIME NOT NULL DEFAULT GETDATE()
// );
@Table({
  tableName: "tbl_ContactForm",
  timestamps: false,
})
export class ContactForm extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  GUID!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  Name!: string;
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  Phone!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  Email!: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  Message!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "CreatedDate",
  })
  CreatedDate!: Date;
}
