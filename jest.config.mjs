import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';
import path from 'path';

// Read tsconfig.json manually
const tsconfigPath = path.resolve('./tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM preset for ts-jest
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat TypeScript files as ESM
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Use a CommonJS setup file
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true, // Enable ESM support in ts-jest
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      outputPath: './jest-report.html',
      pageTitle: 'Test Report'
    }]
  ]
};