module.exports = {
    preset: "jest-preset-angular",
    roots: ["<rootDir>/src"],
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    moduleNameMapper: {
        "@app/(.*)": "<rootDir>/src/app/$1",
        "@assets/(.*)": "<rootDir>/src/assets/$1",
        "@core/(.*)": "<rootDir>/src/app/core/$1",
        "@env": "<rootDir>/src/environments/environment",
        "@src/(.*)": "<rootDir>/src/$1",
        "@services/(.*)": "<rootDir>/src/app/core/services/$1",
        "@helpers/(.*)": "<rootDir>/src/app/helpers/$1",
        "@shared/(.*)": "<rootDir>/src/app/shared/$1",
    },
    coverageDirectory: "./coverage",
    collectCoverageFrom: [
        "src/app/**/*.ts",
        "!**/node_modules/**",
        "!**/test/**",
    ],
    coveragePathIgnorePatterns: [
        "src/app/.*\\.module\\.ts$",
        "src/app/.*-routing\\.module\\.ts$"
    ]
};