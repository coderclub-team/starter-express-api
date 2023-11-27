import { NextFunction, Request, Response } from "express";
import UserAddress from "../models/user-address.model";

export const getMyAddresses = async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  req.body.CreatedGUID = req.body.user.UserGUID;
  req.body.UserGUID = req.body.CreatedGUID;
  try {
    const addresses = await UserAddress.findAll({
      where: {
        UserGUID: req.body.UserGUID,
      },
    });
    res.status(200).send(addresses)
  } catch (error) {
    next(error);
  }

}
export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await UserAddress.create({
      ...req.body,
      CreatedGUID: req.body.user.UserGUID,
      UserGUID: req.body.user.UserGUID,
    });
    res.send({
      message: "User address added successfully!",
      address,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;

  try {
    const address = await UserAddress.findByPk(req.params.AddressGUID);
    if (!address) throw Error("Invalid AddressGUID!");
    delete req.body.UserAddressGUID;
    const useraddress = await address.update(req.body);
    res.status(200).send({
      message: "User addredd updated successfully!",
      useraddress,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;

  try {
    const address = await UserAddress.findByPk(req.params.AddressGUID);
    if (!address) throw Error("Invalid AddressGUID!");
    await address.destroy();
    res.status(200).send({
      message: "User address deleted successfully!",
      params: req.params,
      address,
    });
  } catch (error) {
    next(error);
  }
};
