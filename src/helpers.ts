import * as vscode from 'vscode';

const importsRE = new RegExp('^import', 'gm');
export const extensionKey = 'fold-imports';

export interface ImportsBlock {
  start: number;
  size: number;
}

export enum FoldActions {
  FOLD = 1,
  UNFOLD = 2,
}

const getConfiguration = () =>
  vscode.workspace.getConfiguration(extensionKey) || {};
const getImportLanguages = () => [
  'typescriptreact',
  'typescript',
  'javascript',
  'javascriptreact',
  ...(getConfiguration().extraLanguages || []),
];

/** Returns an array of regexp matches even if the regex has the `g` flag */
export function getRegexpMatches(regexp: RegExp, text: string) {
  // We need the provided regexp to have the G flag.
  if (!regexp.flags.includes('g'))
    throw new Error('The provided regexp needs to be global.');

  const results: Array<RegExpExecArray> = [];
  let match;

  // eslint-disable-next-line
  while ((match = regexp.exec(text))) results.push(match);

  return results;
}

/** Logs to the console if debug mode is enabled. */
export const logger = (...args: any[]) => {
  console.log(...args);
};

/** Finds the import block in the document. */
export function findImportsBlock(
  document: vscode.TextDocument
): ImportsBlock | undefined {
  // If the document doesn't have the languages we set up, nothing to do.
  // Note: VScode adds `.git` at the end of the filename for.. uh... i dont know?
  // So we need to watch for that :(
  if (
    !getImportLanguages().includes(document.languageId) &&
    !document.fileName.endsWith('.git')
  ) {
    logger('[debug] findImportsBlock >', document.languageId, 'not supported');
    return undefined;
  }

  // Get the text of the document.
  const text = document.getText();
  // Find regex matches/
  const matches = getRegexpMatches(importsRE, text);
  if (matches.length < 1) {
    logger('[debug] findImportsBlock >', 'No `import` tokens found');
    return undefined;
  }

  // Find the first and the last line of imports.
  const firstOffset = matches[0].index;
  const firstLine = document.positionAt(firstOffset).line;
  const lastOffset = matches[matches.length - 1].index;
  const lastLine = document.positionAt(lastOffset).line;

  return {
    start: firstLine,
    size: lastLine - firstLine,
  };
}

export function changeFoldingOfImportLines(
  action: FoldActions,
  block: ImportsBlock
) {
  const command = action === FoldActions.FOLD ? 'editor.fold' : 'editor.unfold';
  logger(`Running ${command} at line ${block.start}`);
  // Change folding at the line number.
  vscode.commands.executeCommand(command, {
    levels: 1,
    selectionLines: [block.start],
  });
}

type ShouldAutoFoldImportsResult =
  | {
      success: false;
      reason: string;
    }
  | {
      success: true;
    };
export function shouldAutoFoldImports(
  block: ImportsBlock | undefined
): boolean {
  // If we don't want to automatically fold imports, nothing to do.
  if (!getConfiguration().auto) {
    logger('[debug] shouldAutoFoldImports >', 'Auto fold disabled');
    return false;
  }

  // If we have no lines, nothing to do.
  if (!block) {
    logger('[debug] shouldAutoFoldImports >', 'No import blocks found');
    return false;
  }

  // If there is no import statement, nothing to do.
  if (block.start === -1) {
    logger('[debug] shouldAutoFoldImports >', 'Imports block non-existant');
    return false;
  }

  // If the import block is smaller than the defined minimum size, nothing to do.
  if (block.size < getConfiguration().minimumBlockSize) {
    logger(
      '[debug] shouldAutoFoldImports >',
      `Imports block size (${block.size}) smaller than minimum ${
        getConfiguration().minimumBlockSize
      }`
    );
    return false;
  }

  return true;
}
