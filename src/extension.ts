import * as vscode from 'vscode';
import findLastIndex = require('lodash.findlastindex');

const importsRE = new RegExp('^import', 'i');
const eolToString: { [k in vscode.EndOfLine]: string } = {
  [vscode.EndOfLine.CRLF]: '\r\n',
  [vscode.EndOfLine.LF]: '\n',
};
const extensionKey = 'auto-fold-imports';

interface FoldLineProps {
  start: number;
  end: number;
  size: number;
}

enum FoldActions {
  FOLD = 1,
  UNFOLD = 2,
}

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

export function activate(extensionContext: vscode.ExtensionContext) {
  const foldCommandDisposable = vscode.commands.registerCommand(
    'auto-fold-imports.fold',
    () => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      const importLines = findImportLines(document);

      if (!importLines) {
        return;
      }

      changeFoldingOfImportLines(FoldActions.FOLD, importLines);
    }
  );

  const unfoldCommandDisposable = vscode.commands.registerCommand(
    'auto-fold-imports.unfold',
    () => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      const importLines = findImportLines(document);

      if (!importLines) {
        return;
      }

      changeFoldingOfImportLines(FoldActions.UNFOLD, importLines);
    }
  );

  extensionContext.subscriptions.push(foldCommandDisposable);
  extensionContext.subscriptions.push(unfoldCommandDisposable);

  vscode.workspace.onDidOpenTextDocument((document) => {
    const importLines = findImportLines(document);

    if (!importLines || !shouldFoldImports(importLines)) {
      return;
    }

    changeFoldingOfImportLines(FoldActions.FOLD, importLines);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * Helpers.
 */

function findImportLines(
  document: vscode.TextDocument
): FoldLineProps | undefined {
  if (!importsLanguages.includes(document.languageId)) {
    return undefined;
  }

  // Get the lines of text of the document.
  const lines = document.getText().split(eolToString[document.eol]);
  // Find the first line with an import statement.
  const importLineNumber = lines.findIndex((line) =>
    Boolean(line.trim().match(importsRE))
  );
  const lastLineWithImports = findLastIndex(lines, (line) =>
    Boolean(line.trim().match(importsRE))
  );

  return {
    start: importLineNumber,
    end: lastLineWithImports,
    size: lastLineWithImports - importLineNumber,
  };
}

function changeFoldingOfImportLines(action: FoldActions, lines: FoldLineProps) {
  logger('Gonna fold at line: ' + lines.start);
  // Fold at the found line number
  const command = action === FoldActions.FOLD ? 'editor.fold' : 'editor.unfold';
  vscode.commands.executeCommand(command, {
    levels: 1,
    selectionLines: [lines.start],
  });
}

function shouldFoldImports(lines: FoldLineProps | undefined) {
  if (!lines) {
    return false;
  }

  // If there is no import statement, nothing to do.
  if (lines.start === -1) {
    return false;
  }

  // If the import block is smaller than the defined minimum size, nothing to do.
  if (lines.size < minimumBlockSize) {
    return false;
  }

  return true;
}
