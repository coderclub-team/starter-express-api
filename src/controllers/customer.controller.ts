import { NextFunction, Request, Response } from "express";
import Customer from "../models/customer.model";
import { create } from "ts-node";
import zod from "zod";
import { Op } from "sequelize";

export const createCustomerRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = zod
      .object({
        name: zod.string().min(3).max(50),
        description: zod.string().min(3).max(50).optional(),
        address: zod.string().min(3).max(50).optional(),
        city: zod.string().min(3).max(50).optional(),
        state: zod.string().min(3).max(50).optional(),
        gst_number: zod.string().min(3).max(50).optional(),
        phone: zod.string().min(3).max(50),
        email: zod.string().email(),
      })
      .parse(req.body);

    const [customer, created] = await Customer.findOrCreate({
      where: {
        [Op.or]: [{ MobileNo: schema.phone }, { EmailID: schema.email }],
      },
      defaults: {
        CustomerName: schema.name,
        MobileNo: schema.phone,
        EmailID: schema.email,
        Description: schema.description,
        Address: schema.address,
        City: schema.city,
        State: schema.state,
        GSTNo: schema.gst_number,
      },
    });
    if (!created) {
      if (customer.MobileNo === schema.phone) {
        throw new Error("Mobile number already exists");
      }
      if (customer.EmailID === schema.email) {
        throw new Error("Email ID already exists");
      }
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Find all", req.params);
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

export const findOneById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  try {
    const customer = await Customer.findByPk(customer_id);
    if (!customer) throw new Error("Customer not found");
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};
export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  try {
    await Customer.update(req.body, {
      where: {
        CustomerGUID: customer_id,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  const { force } = req.query;
  try {
    const customer = await Customer.destroy({
      where: {
        CustomerGUID: customer_id,
      },
      force: force === "true" ? true : false,
    });
    if (!customer) throw new Error("Customer not found");
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};
