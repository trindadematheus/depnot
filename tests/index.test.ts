import * as fs from "fs";
import {
  resolvePackagePath,
  readPackageJson,
  getDependenciesToRemove,
  buildRemoveCommand,
} from "../src/index";

jest.mock("fs");

describe("Dependency Removal Script", () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;

  it("should resolve the correct package path", () => {
    const locale = "/mock/path";
    const result = resolvePackagePath(locale);
    expect(result).toBe("/mock/package.json");
  });

  it("should read and parse the package.json", () => {
    const mockPackageJson = {
      dependencies: { "lib-test": "^1.0.0" },
      devDependencies: { "dev-lib-test": "^2.0.0" },
    };

    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = readPackageJson("/mock/package.json");
    expect(result).toEqual(mockPackageJson);
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      "/mock/package.json",
      "utf8"
    );
  });

  it("should get dependencies to remove", () => {
    const packageJson = {
      dependencies: { "lib-test": "^1.0.0", "other-name": "^2.0.0" },
      devDependencies: { "dev-lib-test": "^2.0.0" },
    };
    const result = getDependenciesToRemove(packageJson, "lib", true);
    expect(result).toBe("lib-test dev-lib-test");
  });

  it("should build the correct remove command", () => {
    const result = buildRemoveCommand("npm", "lib-test dev-lib-test");
    expect(result).toBe("npm uninstall lib-test dev-lib-test");
  });
});
