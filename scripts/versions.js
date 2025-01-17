/* eslint-disable import/no-dynamic-require */
/* eslint-disable curly */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable prettier/prettier */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const ORGANIZATION_NAME = '@qtumproject';
const VERSION_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const VERSION = process.argv[2];

const issuesFound = [];
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const run = () => {
  validateSemverCompatibility();

  if (!issuesFound.length) applyVersion();

  report();
};

function validateSemverCompatibility() {
  if (process.argv.length !== 3) {
    issuesFound.push('No version provided');
  }

  if (!VERSION_REGEX.test(VERSION)) {
    issuesFound.push(
      `Version ${VERSION} is not semver compatible, should match https://semver.org/ specification`,
    );
  }
}

function applyVersion() {
  for (const pkg of packages) {
    const packageJsonPath = path.resolve(
      __dirname,
      `../packages/${pkg}/package.json`,
    );
    const packageJson = require(packageJsonPath);

    if (packageJson.version === VERSION) {
      continue;
    }

    packageJson.version = VERSION;

    if (pkg === 'connector') {
      const packageJsonVersionPath = path.resolve(
        __dirname,
        `../packages/${pkg}/src/version.json`,
      );
      const packageJsonVersion = require(packageJsonVersionPath);
      packageJsonVersion.version = `${VERSION}`;

      fs.writeFile(
        packageJsonVersionPath,
        `${JSON.stringify(packageJsonVersion, null, 2)}\n`,
        (err) => {
          if (err)
            issuesFound.push(
              `[${ORGANIZATION_NAME}/${pkg}]: Connector: snap version apply failed: ${err.toString()}`,
            );
        },
      );
    }

    fs.writeFile(
      packageJsonPath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      (err) => {
        if (err)
          issuesFound.push(
            `[${ORGANIZATION_NAME}/${pkg}]: Version apply failed: ${err.toString()}`,
          );
      },
    );

    if (issuesFound.length) break;
  }
}

function report() {
  if (issuesFound.length) {
    console.error(chalk`{red Version {yellow ${VERSION}} apply failed!}`);
    issuesFound.forEach((issue) => {
      console.error(chalk`{red ${issue}}`);
    });
    process.exitCode = 1;
  } else {
    console.log(chalk`{green Version {yellow ${VERSION}} apply passed}`);
    packages.forEach((pkg) => {
      console.error(
        chalk`{yellow [${ORGANIZATION_NAME}/${pkg}]}: {green ${VERSION}}`,
      );
    });
    process.exitCode = 0;
  }
}

run();
