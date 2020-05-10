import * as vscode from 'vscode';
import {
  changeFoldingOfImportLines,
  findImportsBlock,
  FoldActions,
  shouldFoldImports,
} from './helpers';

export function activate(extensionContext: vscode.ExtensionContext) {
  const foldCommandDisposable = vscode.commands.registerCommand(
    'auto-fold-imports.fold',
    () => {
      // No text editor? Nothing to do.
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      // Find the imports block.
      const importBlock = findImportsBlock(document);

      if (!importBlock) {
        return;
      }

      // Trigger folding command.
      changeFoldingOfImportLines(FoldActions.FOLD, importBlock);
    }
  );

  const unfoldCommandDisposable = vscode.commands.registerCommand(
    'auto-fold-imports.unfold',
    () => {
      // No text editor? Nothing to do.
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      // Find the imports block.
      const importBlock = findImportsBlock(document);

      // No import block? Nothing to do.
      if (!importBlock) {
        return;
      }

      // Trigger folding command.
      changeFoldingOfImportLines(FoldActions.UNFOLD, importBlock);
    }
  );

  extensionContext.subscriptions.push(foldCommandDisposable);
  extensionContext.subscriptions.push(unfoldCommandDisposable);

  vscode.workspace.onDidOpenTextDocument((document) => {
    const importsBlock = findImportsBlock(document);

    if (!importsBlock || !shouldFoldImports(importsBlock)) {
      return;
    }

    changeFoldingOfImportLines(FoldActions.FOLD, importsBlock);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
