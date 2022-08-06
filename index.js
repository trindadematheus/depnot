#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const args = process.argv.slice(2, process.argv.length);
const locale = process.env.INIT_CWD;

const manager = args[0];
const libname = args[1];
const withDevDependencies = args[2];

const packageObj = JSON.parse(
  fs.readFileSync(path.resolve(locale, "package.json"), "utf8")
);

let dependenciesStr = Object.keys(packageObj.dependencies).reduce(
  (acc, curr) => {
    if (curr.includes(libname)) {
      acc += `${curr} `;
    }

    return acc;
  },
  ""
);

if (!!withDevDependencies) {
  dependenciesStr = Object.keys(packageObj.devDependencies).reduce(
    (acc, curr) => {
      if (curr.includes(libname)) {
        acc += `${curr} `;
      }

      return acc;
    },
    ""
  );
}

let cmdText = "";

switch (manager) {
  case "yarn":
    cmdText = `yarn remove ${dependenciesStr}`;
    break;
  case "npm":
    cmdText = `npm uninstall ${dependenciesStr}`;
    break;
  case "pnpm":
    cmdText = `pnpm uninstall ${dependenciesStr}`;
    break;
  default:
    cmdText = `npm uninstall ${dependenciesStr}`;
    break;
}

console.log(`\x1b[32m Dependencies to be removed: \x1b[0m`);
console.log(`\x1b[33m ${dependenciesStr} \x1b[0m`);

exec(cmdText);
