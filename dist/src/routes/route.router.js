"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_controller_1 = require("../controllers/route.controller");
const router = (0, express_1.Router)();
router.get("/", route_controller_1.allRoutes);
router.get("/:route_id", route_controller_1.routeById);
exports.default = router;
