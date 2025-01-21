#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { exec } from "child_process";

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const resolvePackagePath = (locale: string): string => {
  return path.resolve(locale, "..", "package.json");
};

export const readPackageJson = (packagePath: string): PackageJson => {
  try {
    const packageContent = fs.readFileSync(packagePath, "utf8");
    return JSON.parse(packageContent);
  } catch (error) {
    throw new Error(
      `Failed to read or parse package.json at ${packagePath}: ${error}`
    );
  }
};

export function getDependenciesToRemove(
  packageObj: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  },
  libname: string,
  includeDevDependencies: boolean
): string {
  const dependencies = Object.keys(packageObj.dependencies || {}).filter(
    (dep) => dep.includes(libname)
  );

  const devDependencies = includeDevDependencies
    ? Object.keys(packageObj.devDependencies || {}).filter((dep) =>
        dep.includes(libname)
      )
    : [];

  return [...dependencies, ...devDependencies].join(" ");
}

export const buildRemoveCommand = (
  manager: "yarn" | "npm" | "pnpm",
  dependencies: string
): string => {
  switch (manager) {
    case "yarn":
      return `yarn remove ${dependencies.trim()}`;
    case "pnpm":
      return `pnpm uninstall ${dependencies.trim()}`;
    case "npm":
    default:
      return `npm uninstall ${dependencies.trim()}`;
  }
};

export const executeCommand = (cmdText: string): void => {
  exec(cmdText, (error, stdout, stderr) => {
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
};

export const main = (): void => {
  const args = process.argv.slice(2);
  const locale = (process.env.INIT_CWD as string) || __dirname;

  const manager = args[0] as "yarn" | "npm" | "pnpm";
  const libname = args[1] || "";
  const withDevDependencies = args[2] === "true";

  const packagePath = resolvePackagePath(locale);
  console.log(`Resolved package path: ${packagePath}`);

  const packageJson = readPackageJson(packagePath);
  const dependencies = getDependenciesToRemove(
    packageJson,
    libname,
    withDevDependencies
  );

  console.log(`\x1b[32m Dependencies to be removed: \x1b[0m`);
  console.log(`\x1b[33m ${dependencies} \x1b[0m`);

  if (!dependencies) {
    console.log("\x1b[33m No matching dependencies found to remove. \x1b[0m");
    return;
  }

  const cmdText = buildRemoveCommand(manager, dependencies);
  executeCommand(cmdText);
};

if (require.main === module) {
  main();
}
