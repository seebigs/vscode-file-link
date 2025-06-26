import * as vscode from 'vscode';
import path from 'path';

export class LinkProvider implements vscode.DocumentLinkProvider {

    linkMatcher: RegExp;
    
    constructor(linkMatcher: RegExp) {
        this.linkMatcher = linkMatcher;
    }

    public async provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken) {
        const links: vscode.DocumentLink[] = [];

        const { uri } = vscode.workspace.getWorkspaceFolder(document.uri) || {};
        const currentWorskpaceFolder = uri ? uri.fsPath : undefined;
        if (currentWorskpaceFolder) {
            for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
                const { text } = document.lineAt(lineNum);
                if (text) {
                    for (const match of text.matchAll(this.linkMatcher)) {
                        const prefix = match[1];
                        const linkPath = match[2];
                        const linkRangeStart = (match.index || 0) + prefix.length;
                        const linkRangeEnd = linkRangeStart + linkPath.length;
                        const resolvedPath = linkPath.charAt(0) === '/' ? 
                            path.join(currentWorskpaceFolder, linkPath) :
                            path.join(path.dirname(document.fileName), linkPath);
                        const linkUri = vscode.Uri.file(resolvedPath);
                        const linkRange = new vscode.Range(lineNum, linkRangeStart, lineNum, linkRangeEnd);
                        const documentLink = new vscode.DocumentLink(linkRange, linkUri);
                        links.push(documentLink);
                    }
                }
            }

            return links;
        }

        return [];
    }

}
