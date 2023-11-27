"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactForm = exports.FAQ = exports.Banner = exports.Walkthrough = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
require("dotenv").config();
let Walkthrough = class Walkthrough extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Walkthrough.prototype, "WalkthroughGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        field: "Title",
    }),
    __metadata("design:type", String)
], Walkthrough.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
        field: "Description",
    }),
    __metadata("design:type", String)
], Walkthrough.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        field: "PhotoPath",
        get() {
            const baseURL = process.env.NODE_ENV == "production"
                ? process.env.STATIC_FILE_URL
                : "http://localhost:3000";
            const path = this.getDataValue("image");
            return baseURL + "/" + path;
        },
    }),
    __metadata("design:type", String)
], Walkthrough.prototype, "image", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Walkthrough.prototype, "SortOrder", void 0);
Walkthrough = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Walkthrough",
        timestamps: false,
    })
], Walkthrough);
exports.Walkthrough = Walkthrough;
// Path: src/models/cms.model.ts
let Banner = class Banner extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Banner.prototype, "BannerGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        field: "Title",
    }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        field: "Description",
    }),
    __metadata("design:type", String)
], Banner.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        field: "PhotoPath",
        get() {
            const baseURL = process.env.NODE_ENV == "production"
                ? process.env.STATIC_FILE_URL
                : "http://localhost:3000";
            const path = this.getDataValue("image");
            return baseURL + "/" + path;
        },
    }),
    __metadata("design:type", String)
], Banner.prototype, "image", void 0);
Banner = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Banners",
        timestamps: false,
    })
], Banner);
exports.Banner = Banner;
let FAQ = class FAQ extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], FAQ.prototype, "GUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], FAQ.prototype, "Question", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: false,
    }),
    __metadata("design:type", String)
], FAQ.prototype, "Answer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "SortOrder",
    }),
    __metadata("design:type", Number)
], FAQ.prototype, "sortOrder", void 0);
FAQ = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_FAQ",
        timestamps: false,
    })
], FAQ);
exports.FAQ = FAQ;
// CREATE TABLE ContactForm (
//   GUID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
//   Name VARCHAR(255) NOT NULL,
//   Email VARCHAR(255) NOT NULL,
//   Message VARCHAR(1000) NOT NULL,
//   CreatedOn DATETIME NOT NULL DEFAULT GETDATE()
// );
let ContactForm = class ContactForm extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], ContactForm.prototype, "GUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ContactForm.prototype, "Name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ContactForm.prototype, "Phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ContactForm.prototype, "Email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ContactForm.prototype, "Message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        field: "CreatedDate",
    }),
    __metadata("design:type", Date)
], ContactForm.prototype, "CreatedDate", void 0);
ContactForm = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ContactForm",
        timestamps: false,
    })
], ContactForm);
exports.ContactForm = ContactForm;
