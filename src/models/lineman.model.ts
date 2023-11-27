import {
  AfterCreate,
  AutoIncrement,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import { Request } from "express";
import moment from "moment";
import Message from "../entities/message.class";
import User from "./user.model";
import jwt from "jsonwebtoken";

@Table({
  tableName: "tbl_Lineman",
  createdAt: "CreatedDate",
  updatedAt: false,
  deletedAt: false,
})
export default class Lineman extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  LineManGUID?: string;
  @Column
  LineManID?: string;
  @Column
  LineManName?: string;
  @Column
  Address?: string;
  @Column
  City?: string;
  @Column
  State?: string;
  @Column
  PinCode?: string;
  @Column
  MobileNo?: string;
  @Column
  EmailAddress?: string;
  @Column
  ShopID?: string;
  @Column
  StoreGUID?: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => User)
  CreatedGUID?: number | null;
  @Column
  CreatedDate?: Date;
  @Column
  ModifiedGUID?: number;
  @Column
  DeletedGUID?: number;
  @Column
  ModifiedDate?: Date;
  @Column
  DeletedDate?: Date;
  @Column
  CommissionStatusGUID?: string;
  @Column
  IncentiveStatusGUID?: string;
  @Column
  IsActive?: string;
  @Column
  Password?: string;

  @Column({
    type: DataType.TINYINT,
    defaultValue: 0,
    allowNull: false,
  })
  public Password_Attempt!: number;

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
  @Column
  IsPhoneVerified?: number;

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
  @Column
  Status?: number;
  @Column
  AadhaarFrontFilePath?: string;
  @Column
  AadhaarBackFilePath?: string;

  @Column
  DrivingLicenceFrontFilePath?: string;

  @Column
  DrivingLicenceBackFilePath?: string;

  @BeforeCreate
  static async hashPassword(instance: Lineman) {
    if (instance.Password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(instance.Password, salt);
      instance.Password = hash;
      const { OTP, OtpExpiryDate } = instance.generateOTP();
      instance.OTP = OTP;
      instance.OtpExpiryDate = OtpExpiryDate;
      return instance;
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
  async sendOTP(): Promise<Lineman> {
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
  verifyOTP(otp: string): Promise<Lineman> {
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
      this.IsPhoneVerified = 1;
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
  ): Promise<Lineman> {
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
      const lineman = await Lineman.findOne({
        where: {
          PhoneNumber: PhoneNumber,
        },
      });
      if (!lineman) {
        return Promise.reject("lineman not found");
      }
      const { OTP, OtpExpiryDate } = lineman.generateOTP();
      lineman.OTP = OTP;
      lineman.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
      return await lineman.save();
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
  @BeforeBulkCreate
  @BeforeBulkUpdate
  static beforeBulkCreateHook(instances: Lineman[]) {
    instances.forEach((instance) => {
      Object.entries(instance.toJSON()).forEach(([key, value]) => {
        if (typeof value === "string") {
          instance.setDataValue(key as keyof Lineman, value.trim());
        }
      });
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: Lineman) {
    Object.entries(instance.toJSON()).forEach(([key, value]) => {
      if (typeof value === "string") {
        instance.setDataValue(key as keyof Lineman, value.trim());
      }
    });
  }

  @AfterCreate
  static async afterCreateHook(instance: Lineman) {
    instance.LineManID =
      "LM" + instance.LineManGUID?.toString().padStart(6, "0");
    try {
      await instance.save();
    } catch (error) {
      console.log(error);
    }
  }

  setFullURL(request: Request, key: keyof Lineman) {

 
    const hostname = request.protocol + "://" + request.get("host");
    const originalPath =
      this.getDataValue(key) || "identities/lineman-identity.png";
    if (!originalPath) return;
    const fullPath = `${hostname}/${originalPath}`;
    this.setDataValue(key, fullPath);
    
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
    } else if (!(await bcrypt.compare(password, this.Password!))) {
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
}
