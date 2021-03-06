#!/usr/bin/env node
"use strict";

const meow = require('meow');

const _require = require('./choose-license'),
      chooseLicense = _require.chooseLicense;

const _require2 = require('./initiators/search-license'),
      searchLicense = _require2.searchLicense;

const _require3 = require('./initiators/generate-list'),
      generateList = _require3.generateList;

const _require4 = require('./initiators/license-exists.js'),
      licenseFileExists = _require4.licenseFileExists,
      licenseExistsPrompt = _require4.licenseExistsPrompt,
      viewExistingLicense = _require4.viewExistingLicense,
      licenseExistsExit = _require4.licenseExistsExit,
      licenseExistsPromptChoices = _require4.licenseExistsPromptChoices;

const cli = meow(`Usage:
    $ licensed                  # Brings up an option to start a questionnaire or choose from a list of available licenses
    $ licensed <license-name>   # Brings prompt to enter your name
    $ licensed <license-name> <your-full-name> [--year | -y] <year>
    $ licensed [--list | -l]

Options:
    --year, -y <year>   Manually enter year the license is in effect
    --list, -l          List all available licenses
    --help              Show this screen
    --version           Show version

Examples:
    $ licensed mit "Mihir Chaturvedi"
    $ licensed apache
    $ licensed --year 2013-2018

Read more about the different types of open
source licenses on https://opensource.org/licenses.

Questions inspired from https://choosealicense.com.
Special thanks to Manuel Spagnolo for implementation of questionnaire.

Copyright (c) 2018, Mihir Chaturvedi`, {
  flags: {
    year: {
      type: 'string',
      alias: 'y'
    },
    list: {
      type: 'boolean',
      alias: 'l'
    }
  }
});

const start = (userInput, flags) => {
  /**
   * If called without inputs,
   * get a list of available inputs and prompt the
   * user to choose some stuff.
   */
  if (!userInput.length) {
    chooseLicense(flags);
  }
  /**
   * If called with an input
   * fuzzy search amongst license names
   * and return the first result
   */
  else {
      searchLicense({
        input: userInput
      }, flags);
    }
};
/**
 * If licensed is called with
 * `-l` or `--list` flag, generate
 * a list of available licenses to
 * choose from
 */


if (cli.flags.l) {
  generateList();
} else {
  /**
   * If a LICENSE file already exists
   * ask user whether to continue with
   * process or abort
   */
  if (licenseFileExists()) {
    licenseExistsPrompt().then(response => {
      /* If user decides to abort */
      if (response === licenseExistsPromptChoices[0]) {
        licenseExistsExit();
        return;
      }
      /* If user decides to view existing license */


      if (response === licenseExistsPromptChoices[1]) {
        viewExistingLicense();
        return;
      }
      /* If user decides to continue with creating a new license */


      start(cli.input, cli.flags);
    });
  } else {
    start(cli.input, cli.flags);
  }
}