# Notes for Development

## package.json

`package.json` file contains configurations mixed for multiple tools.

- NPM: https://docs.npmjs.com/cli/v8/configuring-npm/package-json

### main and exports

Enable this library to be imported as CommonJS and ESModule.

https://nodejs.org/api/packages.html#main-entry-point-export

### Files

Published package contains only specified files.

- https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files

### scripts

Utility commands for developer.

- dev: Watch sources and run tests
- test: Run test once
- bench: Run benchmark script
- pack: Build for publish

## tsconfig

- tsconfig.json: Base configuration. Configured for development
- tsconfig.commonjs.json: For CommonJS version e
- tsconfig.esm.json: For ESModule package

- module: https://www.typescriptlang.org/tsconfig#module
