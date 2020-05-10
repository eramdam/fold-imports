import * as vscode from 'vscode';
import {
  changeFoldingOfImportLines,
  findImportLines,
  FoldActions,
  shouldFoldImports,
} from './helpers';

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
