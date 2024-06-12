import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class CompleteHeaderProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        // Ensure the document is a Markdown file
        if (document.languageId !== 'markdown') {
            return [];
        }

        const completionItems: vscode.CompletionItem[] = [];
        const headings: string[] = [];

        // Parse the document to extract headings
        const text = document.getText();
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('#')) {
                // Extract the heading text and add it to the array
                let heading = line.replace(/^#+\s*/, '').replace(/ /g, "-").toLowerCase();
                headings.push(heading);
            }
        }

        // Create completion items from the headings
        headings.forEach((heading, index) => {
            const item = new vscode.CompletionItem(heading, vscode.CompletionItemKind.Text);
            item.sortText = `A_${index.toString().padStart(3, '0')}`
            completionItems.push(item);
        });

        // Include files from src/tables and src/media
        const srcPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (srcPath) {
            this.addFilesFromDirectory(completionItems, srcPath, 'src/tables');
            this.addFilesFromDirectory(completionItems, srcPath, 'src/media');
        }

        return completionItems;
    }

    addFilesFromDirectory(completionItems: vscode.CompletionItem[], basePath: string, srcPath: string) {
        const fullPath = path.join(basePath, srcPath)
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath);
            files.forEach((file, index) => {
                const item = new vscode.CompletionItem(path.join("..", srcPath, file), vscode.CompletionItemKind.File);
                item.detail = fullPath; // Optionally add detail to show the directory path
                item.sortText = `B_${index.toString().padStart(3, '0')}`
                completionItems.push(item);
            });
        }
    }
}

// Register the provider for Markdown files
export function activate(context: vscode.ExtensionContext) {
    const provider = new CompleteHeaderProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'markdown', scheme: 'file' }, provider, '{'));
}

export function deactivate() {}
