import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class SnippetCompletion implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        const completionItems: vscode.CompletionItem[] = [
            this.createSnippetItem('cref{${1:}}'),
            this.createSnippetItem('Cref{${1:}}'),
            this.createSnippetItem('vref{${1:}}'),
            this.createSnippetItem('Vref{${1:}}'),
            this.createSnippetItem('href{${1:}}'),
            this.createSnippetItem('url{${1:$CLIPBOARD}}'),
            this.createSnippetItem('gn{${1:}}'),
            this.createSnippetItem('gt{${1:}}'),
            this.createSnippetItem('clearpage\n'),
            this.createSnippetItem('tdxfixparagraph\n'),
            this.createSnippetItem('textdegree'),
            this.createSnippetItem('input{${1:table}}'),
            this.createSnippetItem('textsubscript{${1:}}'),
            this.createSnippetItem('tdxfigure[width=\\linewidth]{fig:${3:figure LABEL tab here}}{${2:CAPTION tab here}}{${1:media}}'),
            this.createSnippetItem('tipbox{\\textbf{${1:bold title}}\\newline\n\t${2:tab here}\n}'),
            this.createSnippetItem('notebox{\\textbf{${1:bold title}}\\newline\n\t${2:tab here}\n}'),
            this.createSnippetItem('importantbox{\\textbf{${1:bold title}}\\newline\n\t${2:tab here}\n}'),
            this.createSnippetItem('warningbox{\\textbf{${1:bold title}}\\newline\n\t${2:tab here}\n}')
        ];

        return completionItems;
    }

    createSnippetItem(snippet: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(snippet, vscode.CompletionItemKind.Snippet);
        item.insertText = new vscode.SnippetString(snippet);

        // Command to trigger suggestions after snippet is inserted
        item.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger suggestions' };
        
        return item;
    }
}