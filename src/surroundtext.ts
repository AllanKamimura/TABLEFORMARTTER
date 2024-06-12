import * as vscode from 'vscode';

export function latexTag(tag: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showWarningMessage('No text selected');
            return;
        }

        // Regular expression to check if the selected text is already wrapped with the specified tag
        const tagRegex = new RegExp(`^\\\\${tag}\\{(.*)\\}$`);
        let newText: string;

        if (tagRegex.test(selectedText)) {
            // If text is already wrapped with the tag, remove the tag
            newText = selectedText.replace(tagRegex, '$1');
        } else {
            // Otherwise, add the tag
            newText = `\\${tag}{${selectedText}}`;
        }

        // Replace the selected text with the modified text
        editor.edit(editBuilder => {
            editBuilder.replace(selection, newText);
        });

    } else {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }
}