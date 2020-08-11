# Change Log

All notable changes to the "fold-imports" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.4 - 2020-08-10
- Fix regression introduced in 1.0.3 that would cause the imports to get folded when using alt+click to peek at a JS/TS symbol

## 1.0.3 - 2020-07-26

- Fix the logic that checks whether or not to try to fold the imports of the currently opened document
- Improve debug logging

## 1.0.2 - 2020-05-25

- Fix a bug where triggering `Peek definition` on an imported type ended up folding the imports of the currently active document (https://github.com/eramdam/fold-imports/pull/3)

## 1.0.1 - 2020-05-14

- Fix a bug in the imports block detection so that it works properly when detecting import blocks that start after the first line of the document. (https://github.com/eramdam/fold-imports/commit/7b5ea459e088686acaaaeeff16505128777c9119)

## 1.0.0 - 2020-05-11

- Initial release 🎉
