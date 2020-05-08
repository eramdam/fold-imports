import * as vscode from 'vscode';
import findLastIndex = require('lodash.findlastindex');

const importsRE = new RegExp('^import', 'i');
const eolToString: { [k in vscode.EndOfLine]: string } = {
  [vscode.EndOfLine.CRLF]: '\r\n',
  [vscode.EndOfLine.LF]: '\n',
};
const extensionKey = 'auto-fold-imports';

export function activate() {
  const configuration = vscode.workspace.getConfiguration(extensionKey);
  const importsLanguages: string[] = [
    'typescriptreact',
    'typescript',
    'javascript',
    'javascriptreact',
    ...(configuration.extraLanguages || []),
  ];
  const { minimumBlockSize } = configuration;

  const logger = (...args: any[]) => {
    if (configuration.debug) {
      console.log(...args);
    }
  };

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (importsLanguages.includes(document.languageId)) {
      // Get the lines of text of the document.
      const lines = document.getText().split(eolToString[document.eol]);
      // Find the first line with an import statement.
      const importLineNumber = lines.findIndex((line) =>
        Boolean(line.trim().match(importsRE))
      );
      const lastLineWithImports = findLastIndex(lines, (line) =>
        Boolean(line.trim().match(importsRE))
      );

      // If there is no import statement, nothing to do.
      if (importLineNumber === -1) {
        return;
      }

      // If the import block is smaller than the defined minimum size, nothing to do.
      if (lastLineWithImports - importLineNumber < minimumBlockSize) {
        return;
      }

      logger('Gonna fold at line: ' + importLineNumber);
      // Fold at the found line number
      vscode.commands.executeCommand('editor.fold', {
        levels: 1,
        selectionLines: [importLineNumber],
      });
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
