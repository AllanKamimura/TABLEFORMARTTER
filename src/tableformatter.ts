import * as vscode from 'vscode';

export function formatLatexTable(table: string): string {
    var tableRegex = /(\\tdxtable(?:\<[\s\S]+\>)?(?:\[.*\])?(?:\{.*\}){1}(?:\<.*\>)?(?:\[[^\\]*\])?[\n\r]?)\{([\s\S]*)\}(?:\[([\s\S]*?)\])/
    
    var match = table.trim().match(tableRegex);
    
    if (!match) {
        tableRegex = /(\\tdxtable(?:\<[\s\S]+\>)?(?:\[.*\])?(?:\{.*\}){1}(?:\<.*\>)?(?:\[[^\\]*\])?[\n\r]?)\{([\s\S]*)\}(?:\[([\s\S]*?)\])?/
    
        match = table.trim().match(tableRegex);

        if (!match) {
            throw new Error("Table not found.")
        }
    }

    console.log("START \n\n");
    console.log(match);
    for (let i = 1; i < match.length; i++) {
        console.log(`Group ${i}:`, match[i]);
        console.log("");
    }

    const [, tableHeader, tableContents, footnotes] = match;

    // Iterate the table of contents to find the max column size
    const lines = tableContents.split(/\\\\[ ]*[\r\n]+/).slice(0, -1);

    const n_columns = lines[0].split("&").length;

    const columnWidths = new Array(n_columns).fill(0);

    for (const line of lines) {
        const cells = line.trim().split("&");
        console.log(cells);

        if (cells.length === n_columns) {
            for (let j = 0; j < n_columns; j++) {
                columnWidths[j] = Math.max(columnWidths[j], cells[j].trim().length);
            }
        }
    }

    console.log(columnWidths);

    let new_table = tableHeader + "{\n";

    for (const line of lines) {
        const cells = line.trim().split("&");
        let new_line = "\t";

        if (cells.length === n_columns) {
            for (let j = 0; j < n_columns; j++) {
                const separator = (j === n_columns - 1) ? " \\\\" : " & ";
                new_line += cells[j].trim().padEnd(columnWidths[j], " ") + separator;
            }
        } else {
            new_line += cells.join("") + " \\\\";
        }

        new_table += new_line + "\n";
    }

    new_table += "}";

    if (footnotes !== undefined) {
        new_table += "[" + footnotes + "]";
    }

    return new_table;
}

export function tableFormatterCommand() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        if (document.languageId === 'latex') {
            const text = document.getText();
            const formattedText = formatLatexTable(text);

            editor.edit(editBuilder => {
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
                editBuilder.replace(fullRange, formattedText);
            }, { undoStopBefore: true, undoStopAfter: true });

            vscode.window.showInformationMessage('Table formatted successfully!');
        } else {
            vscode.window.showErrorMessage('Document extension is not .tex');
        }
    } else {
        vscode.window.showErrorMessage('No active editor found.');
    }
}
