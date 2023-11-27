"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trimRequestBody(req, res, next) {
    function traverse(obj) {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = obj[key].trim();
            }
            else if (typeof obj[key] === "object") {
                traverse(obj[key]);
            }
        }
    }
    traverse(req.body);
    next();
}
exports.default = trimRequestBody;
