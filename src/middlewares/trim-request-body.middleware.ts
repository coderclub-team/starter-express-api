import { NextFunction, Request, Response } from "express";

function trimRequestBody(req: Request, res: Response, next: NextFunction) {
  function traverse(obj: any) {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === "object") {
        traverse(obj[key]);
      }
    }
  }
  traverse(req.body);
  next();
}

export default trimRequestBody;
