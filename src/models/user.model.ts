import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeUpdate,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  ForeignKey,
  HasMany,
  AfterCreate,
  BelongsTo,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import crypto from "crypto";

import moment from "moment";
import { DataTypes } from "sequelize";

import jwt from "jsonwebtoken";
import UserAddress from "./user-address.model";
import { Request } from "express";
import Message from "../entities/message.class";
import ProductSubscription from "./product-subscription.model";
import { Route } from "./route.model";
import Sale from "./sale.model";

// 
@Table({
  tableName: "tbl_Users",
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public UserGUID!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      // regex for First Name
      is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    },
  })
  public FirstName!: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      notEmpty: true,
      // regex for Last Name
      is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    },
  })
  public LastName!: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    validate: {
      notEmpty: true,
      // regex for Full Name
      is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    },
  })
  FullName!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      isIn: [["Male", "Female", "Transgender", null]],
    },
  })
  Gender!: string;

  // DoorNumber VARCHAR(10) NULL,
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  DoorNumber!: string;

  // SteetName VARCHAR(100) NULL,
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  Street!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  Area!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  Landmark!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: "./identities/user-identity.png",
  })
  PhotoPath!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  public LoginName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public Password!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,

    validate: {
      isEmail: true,
    },
  })
  public EmailAddress!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      // regex for mobile number
      is: /^[0-9]{10,15}$/,
    },
  })
  public MobileNo!: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    validate: {
      // regex for landline
      is: /^[0-9-]{10,20}$/,
    },
  })
  public Landline!: number | null;

  @Column
  @ForeignKey(() => UserAddress)
  PrimaryAddressGUID?: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    validate: {
      isEighteenOrOlder: function (value: Date) {
        if (!value) return;
        // Calculate user's age based on date of birth
        const age = moment().diff(moment(value), "years");

        // Check if user is at least 18 years old
        if (age < 18) {
          throw new Error("User must be at least 18 years old");
        }
      },
    },
  })
  public DOB!: Date | null;

  @Column({
    type: DataType.STRING(200),
    validate: {},
  })
  public Address!: string | null;

  @Column({
    type: DataType.STRING(200),
    validate: {},
  })
  public City!: string | null;

  @Column({
    type: DataType.STRING(200),
    validate: {},
  })
  public State!: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  public Status!: number;

  @Column({
    type: DataType.TINYINT,
    defaultValue: null,
    allowNull: true,
  })
  public Password_Attempt!: number | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  public Account_Deactivated!: Date | null;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  public OTP!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  OtpExpiryDate!: Date | null;

  @Column
  DeviceToken!: string;

  @Column
  DeviceType!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  public Logouttime!: Date | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  public AuthID!: string | null;



  @CreatedAt
  @Column({
    type: DataType.DATEONLY,
  })
  public CreatedDate!: Date | null;

  @UpdatedAt
  @Column({
    type: DataType.DATEONLY,
  })
  public ModifiedDate!: Date | null;

  @DeletedAt
  @Column({
    type: DataType.DATEONLY,
  })
  public DeletedDate!: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public CreatedGUID!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public ModifiedGUID!: number | null;

  @ForeignKey(() => Route)
  @Column
  RouteRefGUID!: number;

  @BelongsTo(() => Route)
  Route?: Route;
  

  @Column
  StoreGUID!: number;
  static readonly fields = {
    password: { type: DataTypes.STRING, allowNull: false, exclude: true },
  };

  @Column
  DigitalCard?: number;

  private _token!: string;

  get token(): string {
    return this.token;
  }
  set token(token: string) {
    this._token = token;
  }

  @HasMany(() => UserAddress)
  Addresses?: UserAddress;

  @HasMany(() => ProductSubscription)
  Subscriptions?: ProductSubscription[];

  @HasMany(() => Sale)
  Orders?: Sale[];

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.Password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(instance.Password, salt);
      instance.Password = hash;
      const { OTP, OtpExpiryDate } = instance.generateOTP();
      instance.OTP = OTP;
      instance.OtpExpiryDate = OtpExpiryDate;
    }
  }
  @AfterCreate
  static async sendOTPMessage(instance: User) {
    if (instance.MobileNo) {
      const { OTP, OtpExpiryDate } = instance;
      instance.OTP = OTP;
      instance.OtpExpiryDate = OtpExpiryDate;
      await Message.sendWelcomeMessage({
        MobileNo: instance.getDataValue("MobileNo"),
        OTP: OTP!,
      });
    }
  }

  async authenticate(password: string): Promise<string> {
    if (!password) {
      return Promise.reject("Password is required");
    }
    // else if (this.Password_Attempt && this.Password_Attempt >= 3) {
    //   return Promise.reject(
    //     "Account is locked due to multiple incorrect password attempts"
    //   );
    // }
    else if (this.Account_Deactivated) {
      return Promise.reject("Account is deactivated");
    } else if (this.Status == 0) {
      return Promise.reject("Account is not activated");
    } else if (!(await bcrypt.compare(password, this.Password))) {
      if (this.Password_Attempt) {
        this.Password_Attempt = this.Password_Attempt + 1;
      } else {
        this.Password_Attempt = 1;
      }
      await this.save({
        fields: ["Password_Attempt"],
      });

      return Promise.reject("Incorrect password");
    } else if (this.Status == 0) {
      return Promise.reject("Account is not activated");
    }

    try {
      if (process.env.JWT_SECRET) {
        const token = jwt.sign(
          this.get({ plain: true }),
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        return Promise.resolve(token);
      } else {
        throw new Error("JWT_SECRET not found");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  generateOTP(): {
    OTP: string;
    OtpExpiryDate: Date;
  } {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    if (process.env.NODE_ENV !== "production") {
      OTP = "998877";
    }
    // one hour from now
    const OtpExpiryDate = new Date(Date.now() + 60 * 60 * 1000);

    return {
      OTP,
      OtpExpiryDate,
    };
  }
  async sendOTP(): Promise<User> {
    console.log("sendOTP-this", this);
    try {
      // if (this.Status == 0) {
      //   console.log("sendOTP-this.Status", this.Status);
      //   return Promise.reject("Account is not activated");
      // } else

      if (this.Account_Deactivated) {
        return Promise.reject("Account is deactivated by admin");
      }
      // else if (this.Password_Attempt && this.Password_Attempt >= 3) {
      //   return Promise.reject("Account is locked due to multiple attempts");
      // }

      const { OTP, OtpExpiryDate } = this.generateOTP();
      this.OTP = OTP;
      this.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
      await Message.sendOTPMessage({
        MobileNo: this.getDataValue("MobileNo"),
        OTP: OTP,
      });
      return await this.save();
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  verifyOTP(otp: string): Promise<User> {
    try {
      if (!otp) {
        return Promise.reject("OTP is required");
      } else if (!this.OTP) {
        return Promise.reject("OTP is not generated");
      } else if (this.OTP != otp) {
        return Promise.reject("OTP is incorrect");
      } else if (
        this.OtpExpiryDate &&
        moment(this.OtpExpiryDate).isBefore(moment())
      ) {
        return Promise.reject("OTP is expired");
      }

      this.OTP = null;
      this.OtpExpiryDate = null;
      this.Password_Attempt = 0;
      this.Status = 1;
      return this.save();
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  async resetPassword(
    password: string,
    otp: string,
    email?: string,
    mobileno?: string
  ): Promise<User> {
    try {
      if (!password) {
        return Promise.reject("Password is required");
      } else if (!this.OTP) {
        return Promise.reject("OTP is not generated");
      } else if (this.OTP != otp) {
        return Promise.reject("OTP is incorrect");
      } else if (!this.OtpExpiryDate) {
        return Promise.reject("OTP is not generated");
      } else if (moment(this.OtpExpiryDate).isBefore(moment())) {
        return Promise.reject("OTP is expired");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      this.Password = hash;
      this.OTP = null;
      this.OtpExpiryDate = null;
      this.Password_Attempt = 0;
      this.Status = 1;
      if (email) {
        this.EmailAddress = email;
      }
      if (mobileno) {
        this.MobileNo = mobileno;
      }

      return await this.save({
        fields: ["Password", "OTP", "OtpExpiryDate", "Password_Attempt"],
      });
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  async forgetPassword(PhoneNumber: string) {
    try {
      const user = await User.findOne({
        where: {
          PhoneNumber: PhoneNumber,
        },
      });
      if (!user) {
        return Promise.reject("User not found");
      }
      const { OTP, OtpExpiryDate } = user.generateOTP();
      user.OTP = OTP;
      user.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
      return await user.save();
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
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
    
    // get next identity value
  
  }
  setFullURL(request: Request, key: keyof User) {
    const hostname = request.protocol + "://" + request.get("host");
    const originalPath =
      this.getDataValue(key) || "identities/user-identity.png";
    if (!originalPath) return;
    const fullPath = `${hostname}/${originalPath}`;
    this.setDataValue(key, fullPath);
  }

  // @AfterCreate
  // static async sendWelcomeMessage(instance: User) {
  //   if (instance.Account_Deactivated) {
  //     return Promise.reject("Account is deactivated by admin");
  //   }
  //   // else if (this.Password_Attempt && this.Password_Attempt >= 3) {
  //   //   return Promise.reject("Account is locked due to multiple attempts");
  //   // }

  //   const { OTP, OtpExpiryDate } = instance.generateOTP();
  //   instance.OTP = OTP;
  //   instance.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;

  //   if (instance.MobileNo) {
  //     await Message.sendWelcomeMessage({
  //       MobileNo: instance.getDataValue("MobileNo"),
  //       OTP: instance.getDataValue("OTP"),
  //     });
  //   }
  // }
}
