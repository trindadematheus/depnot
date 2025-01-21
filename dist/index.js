#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const args = process.argv.slice(2);
const locale = process.env.INIT_CWD || __dirname;
const manager = args[0];
const libname = args[1] || "";
const withDevDependencies = args[2] === "true";
const packagePath = path_1.default.resolve(locale, "..", "package.json");
const packageObj = JSON.parse(fs_1.default.readFileSync(packagePath, "utf8"));
let dependenciesStr = Object.keys(packageObj.dependencies || {}).reduce((acc, curr) => {
    if (curr.includes(libname)) {
        acc += `${curr} `;
    }
    return acc;
}, "");
if (withDevDependencies && packageObj.devDependencies) {
    dependenciesStr += Object.keys(packageObj.devDependencies).reduce((acc, curr) => {
        if (curr.includes(libname)) {
            acc += `${curr} `;
        }
        return acc;
    }, " ");
}
let cmdText = "";
switch (manager) {
    case "yarn":
        cmdText = `yarn remove ${dependenciesStr.trim()}`;
        break;
    case "pnpm":
        cmdText = `pnpm uninstall ${dependenciesStr.trim()}`;
        break;
    case "npm":
    default:
        cmdText = `npm uninstall ${dependenciesStr.trim()}`;
        break;
}
console.log(`\x1b[32m Dependencies to be removed: \x1b[0m`);
console.log(`\x1b[33m ${dependenciesStr.trim()} \x1b[0m`);
(0, child_process_1.exec)(cmdText, (error, stdout, stderr) => {
    if (error) {
        console.error(`\x1b[31m Error: ${error.message} \x1b[0m`);
        return;
    }
    if (stderr) {
        console.error(`\x1b[31m STDERR: ${stderr} \x1b[0m`);
        return;
    }
    console.log(`\x1b[32m STDOUT: ${stdout} \x1b[0m`);
});
