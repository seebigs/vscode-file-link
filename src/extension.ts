import * as vscode from 'vscode';
import { LinkProvider } from './LinkProvider';

const APP_NAME = 'fileLink';

// Do not forget to register in "activationEvents" also
const documentTypes = [
    'dart',
    'go',
    'java',
    'javascript',
    'javascriptreact',
    'jsonc',
    'php',
    'python',
    'ruby',
    'typescript',
    'typescriptreact',
];

const defaultLinkRegex = '(@file )([^\\s]+)';


export function activate(context: vscode.ExtensionContext) {

    let documentLinkProviderDisposable: vscode.Disposable | undefined;

    function registerProvider() {
        // Dispose of the old provider if it exists
        if (documentLinkProviderDisposable) {
            documentLinkProviderDisposable.dispose();
        }

        const config = vscode.workspace.getConfiguration(APP_NAME);
        const linkRegexString = config.get('linkRegex', defaultLinkRegex);
        const linkProvider = new LinkProvider(new RegExp(linkRegexString, 'g'));

        // Register the new provider and store the disposable
        documentLinkProviderDisposable = vscode.languages.registerDocumentLinkProvider(documentTypes, linkProvider);
        context.subscriptions.push(documentLinkProviderDisposable);
    }

    registerProvider();

    // Listen for configuration changes and re-register the provider
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(APP_NAME)) {
            registerProvider(); 
        }
    }));
}

export function deactivate() {}
