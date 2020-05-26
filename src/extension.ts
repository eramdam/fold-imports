import * as vscode from 'vscode';
import {
  changeFoldingOfImportLines,
  findImportsBlock,
  FoldActions,
  shouldAutoFoldImports,
  extensionKey,
  logger,
} from './helpers';

export function activate(extensionContext: vscode.ExtensionContext) {
  const foldCommandDisposable = vscode.commands.registerCommand(
    extensionKey + '.fold',
    () => {
      // No text editor? Nothing to do.
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      // Find the imports block.
      const importsBlock = findImportsBlock(document);

      if (!importsBlock) {
        return;
      }

      // Trigger folding command.
      changeFoldingOfImportLines(FoldActions.FOLD, importsBlock);
    }
  );

  const unfoldCommandDisposable = vscode.commands.registerCommand(
    extensionKey + '.unfold',
    () => {
      // No text editor? Nothing to do.
      if (!vscode.window.activeTextEditor) {
        return;
      }

      const { document } = vscode.window.activeTextEditor;
      // Find the imports block.
      const importsBlock = findImportsBlock(document);

      // No import block? Nothing to do.
      if (!importsBlock) {
        return;
      }

      // Trigger folding command.
      changeFoldingOfImportLines(FoldActions.UNFOLD, importsBlock);
    }
  );

  extensionContext.subscriptions.push(foldCommandDisposable);
  extensionContext.subscriptions.push(unfoldCommandDisposable);

  vscode.workspace.onDidOpenTextDocument((document) => {
    const activeDocument = vscode.window.activeTextEditor?.document;

    // If we have an active document and its document isn't the document we just opened, bail out.
    if (
      !!activeDocument &&
      !document.fileName.includes(activeDocument.fileName)
    ) {
      logger('abort', activeDocument, document);
      return;
    }

    const importsBlock = findImportsBlock(document);

    if (!importsBlock || !shouldAutoFoldImports(importsBlock)) {
      return;
    }

    changeFoldingOfImportLines(FoldActions.FOLD, importsBlock);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
