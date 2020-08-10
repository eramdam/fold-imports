import * as vscode from 'vscode';
import {
  changeFoldingOfImportLines,
  findImportsBlock,
  FoldActions,
  shouldAutoFoldImports,
  extensionKey,
  logger,
} from './helpers';
import { nextTick } from 'process';

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
    if (!vscode.window.visibleTextEditors.length) {
      return;
    }

    const activeDocument = vscode.window.visibleTextEditors.find((e) =>
      /**
       * Note: while we would expect `vscode.window.activeDocument` to be defined and accurate, it not always the case.
       * For some reason, the event is triggered a second time with an active document _and_ `.git` at the end of the filename.
       * This seems consistent and the replace is hacky but seems to work well enough for our purpose..
       */
      e.document.fileName.includes(document.fileName.replace('.git', ''))
    )?.document;

    // If we have an active document and its document isn't the document we just opened, bail out.
    if (
      (activeDocument &&
        !document.fileName.includes(activeDocument.fileName)) ||
      !activeDocument
    ) {
      logger('[abort] No valid active document', { activeDocument, document });
      return;
    }

    const importsBlock = findImportsBlock(document);

    if (!importsBlock || !shouldAutoFoldImports(importsBlock)) {
      return;
    }

    logger('[success] going to fold', document.fileName);
    nextTick(() => {
      changeFoldingOfImportLines(FoldActions.FOLD, importsBlock);
    });
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
