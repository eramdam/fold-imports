// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() {
  vscode.workspace.onDidOpenTextDocument((textDoc) => {
    if (textDoc.languageId === 'typescriptreact') {
      const firstLine = textDoc.lineAt(0);
      const textOnFirstLine = firstLine.text;
      console.log({ textOnFirstLine });
      if (!textOnFirstLine.startsWith('import')) {
        return;
      }

      console.log('Gonna fold at the top');

      vscode.commands.executeCommand('editor.fold', {
        levels: 1,
        selectionLines: [0],
      });
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
