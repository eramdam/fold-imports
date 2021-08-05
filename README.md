VSCode now supports this natively, so you don't need this extension anymore 😅
https://code.visualstudio.com/updates/v1_59#_automatically-fold-imports

# Fold Imports

Like the name implies, this extension automatically folds the ES6 imports of JavaScript and TypeScript files.

![](https://raw.githubusercontent.com/eramdam/fold-imports/master/demo.gif?token=AAKYHBHC6TZTQ34PLWV4EOK6YNQFA)

## Installation

Grab the extension on the Marketplace!

https://marketplace.visualstudio.com/items?itemName=eramdam.fold-imports

## Features

- Automatically folds ES6 imports in JavaScript and TypeScript files
- Adds commands to fold and unfold imports of the current file, respectively
  - `auto-fold-imports.fold`
  - `auto-fold-imports.unfold`

## Extension Settings

This extension contributes the following settings:

- `auto-fold-imports.auto`: Controls the automatic folding of imports.
- `auto-fold-imports.debug`: Whether to print debug statements or not.
- `auto-fold-imports.minimumBlockSize`: How big an imports block needs to be before it's auto folded.
- `auto-fold-imports.extraLanguages`: Extra languages in which to auto folds.

## Release Notes

See the [changelog](CHANGELOG.md)
