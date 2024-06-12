import * as vscode from 'vscode';

function findCellIndexes(lineText: string): { indexes: number[]} {
    const indexes: number[] = []

    const startOfLine = lineText.indexOf("\t")
    const endOfLine   = lineText.lastIndexOf("\\\\", lineText.length - 1)

    indexes.push(startOfLine)
    let currentIndex = lineText.indexOf("&")
    
    while (currentIndex !== -1) {
        indexes.push(currentIndex)
        currentIndex = lineText.indexOf("&", currentIndex + 2)
    }
    indexes.push(endOfLine)

    return { indexes }
}

function findClosestCell(indexes: number[], cursorIndex: number): {cellStart: number, cellEnd:number} {
    let cellStart  = cursorIndex
    let cellEnd = cursorIndex
    
    for (let i = 0; i < indexes.length - 1; i++) {
        if (indexes[i] < cursorIndex && cursorIndex < indexes[i + 1]) {
            cellStart = indexes[i]
            cellEnd   = indexes[i + 1]
        }
    }

    return {cellStart, cellEnd}

}

export function selectTextBetweenBrackets() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const document = editor.document
    const selection = editor.selection
    const position = selection.active

    const lineIndex = position.line
    const lineText = document.lineAt(lineIndex).text
    const cursorIndex = position.character

    const { indexes } = findCellIndexes(lineText)
    const {cellStart, cellEnd} = findClosestCell(indexes, cursorIndex)

    const leftIndex  = lineText.indexOf("{", cellStart)
    const rightIndex = lineText.lastIndexOf("}", cellEnd)
    
    const newSelection = new vscode.Selection(
        new vscode.Position(lineIndex, leftIndex  + 1),
        new vscode.Position(lineIndex, rightIndex)
    )

    editor.selection = newSelection
}
