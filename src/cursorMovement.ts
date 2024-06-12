import * as vscode from 'vscode'
import { selectTextBetweenBrackets } from './selectText'

export function moveCursor(direction: 'left' | 'right' | 'up' | 'down') {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const document = editor.document
    const selection = editor.selection

    if (!selection.isEmpty){

        const position = selection.active;

        var lineIndex = position.line 

        const lineText = document.lineAt(lineIndex).text;
        const cursorIndex = position.character;

        let newCursorIndex = cursorIndex;
        let newLineIndex   = lineIndex

        if (direction === 'left' || direction === 'right') {

            if (direction === 'left') {
                // Find the previous '&' symbol
                const previousIndex = lineText.lastIndexOf('&', cursorIndex - 1);

                if (previousIndex !== -1) {
                    const previouspreviousIndex = lineText.lastIndexOf('&', previousIndex - 1);
                    if (previousIndex !== -1) {
                        newCursorIndex = previouspreviousIndex + 3;
                    } 
                } else {
                    lineIndex -= 1
                    const prevLine = document.lineAt(lineIndex).text;

                    const previouspreviousIndex = prevLine.lastIndexOf('&', prevLine.length - 1);
                    if (previouspreviousIndex !== -1) {
                        newCursorIndex = previouspreviousIndex + 3;
                    } 

                }

            }
            
            if (direction === 'right') {
                // Find the next '&' symbol
                const nextIndex = lineText.indexOf('&', cursorIndex + 1);

                if (nextIndex !== -1) {
                    newCursorIndex = nextIndex  + 3;
                } 
                else {
                    // Move to the start of the next line
                    const nextLine = position.line + 1;
                    if (nextLine < document.lineCount) {
                        lineIndex += 1
                        newCursorIndex = 2
                    }
                }
            }

        }

        if (direction === 'up' || direction === 'down') {
            if (direction  === 'up')   {newLineIndex -= 1} // line numbering goes from up to down
            if (direction  === 'down') {newLineIndex += 1}

        }

        const newPosition = new vscode.Position(newLineIndex, newCursorIndex)
        const newSelection = new vscode.Selection(newPosition, newPosition)
        editor.selection = newSelection
        editor.revealRange(new vscode.Range(newPosition, newPosition))

        selectTextBetweenBrackets()

    } 
    
    else {
             if (direction === 'left'  ){vscode.commands.executeCommand('cursorLeft' )}
        else if (direction === 'right' ){vscode.commands.executeCommand('cursorRight')}
        else if (direction === 'up'    ){vscode.commands.executeCommand('cursorUp'   )}
        else if (direction === 'down'  ){vscode.commands.executeCommand('cursorDown' )}
    }
}