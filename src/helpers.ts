import * as vscode from 'vscode';

const importsRE = new RegExp('^import', 'gm');
const extensionKey = 'auto-fold-imports';

export interface FoldLineProps {
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

export const logger = (...args: any[]) => {
  if (configuration.debug) {
    console.log(...args);
  }
};

export function findImportLines(
  document: vscode.TextDocument
): FoldLineProps | undefined {
  if (!importsLanguages.includes(document.languageId)) {
    return undefined;
  }

  const text = document.getText();
  const matches = getRegexpMatches(importsRE, text);
  if (matches.length < 1) {
    return undefined;
  }

  const firstLine = matches[0].index;
  const lastLine = matches[matches.length - 1].index;

  return {
    start: firstLine,
    size: lastLine - firstLine,
  };
}

export function changeFoldingOfImportLines(
  action: FoldActions,
  lines: FoldLineProps
) {
  const command = action === FoldActions.FOLD ? 'editor.fold' : 'editor.unfold';
  logger(`Running ${command} at line ${lines.start}`);
  // Change folding at the line number.
  vscode.commands.executeCommand(command, {
    levels: 1,
    selectionLines: [lines.start],
  });
}

export function shouldFoldImports(lines: FoldLineProps | undefined) {
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
