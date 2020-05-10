import * as vscode from 'vscode';

const importsRE = new RegExp('^import', 'gm');
const extensionKey = 'auto-fold-imports';

export interface ImportsBlock {
  start: number;
  size: number;
}

export enum FoldActions {
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
  if (configuration.debug) {
    console.log(...args);
  }
};

/** Finds the import block in the document. */
export function findImportsBlock(
  document: vscode.TextDocument
): ImportsBlock | undefined {
  // If the document doesn't have the languages we set up, nothing to do.
  if (!importsLanguages.includes(document.languageId)) {
    return undefined;
  }

  // Get the text of the document.
  const text = document.getText();
  // Find regex matches/
  const matches = getRegexpMatches(importsRE, text);
  if (matches.length < 1) {
    return undefined;
  }

  // Find the first and the last line of imports.
  const firstLine = matches[0].index;
  const lastLine = matches[matches.length - 1].index;

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

export function shouldFoldImports(block: ImportsBlock | undefined) {
  // If we have no lines, nothing to do.
  if (!block) {
    return false;
  }

  // If there is no import statement, nothing to do.
  if (block.start === -1) {
    return false;
  }

  // If the import block is smaller than the defined minimum size, nothing to do.
  if (block.size < minimumBlockSize) {
    return false;
  }

  return true;
}
