import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
