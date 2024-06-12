// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { tableFormatterCommand }     from './tableformatter'
import { moveCursor }                from './cursorMovement'
import { latexTag }                  from './surroundtext';
import { CompleteHeaderProvider }    from './customHeader';
import { SnippetCompletion }         from './customSnippets'
import { selectTextBetweenBrackets } from './selectText';

const True = true
const False = false

function print(variable: any) {
	console.log(variable)
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (print) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	print('Congratulations, your extension "tableformatter" is now active!')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('tableformatter.helloWorld', () => {vscode.window.showInformationMessage('Hello World from tableformatter!')}))
	
    // Custom snippets and code completion
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'markdown', scheme: 'file' }, new SnippetCompletion()     , '\\'))
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'markdown', scheme: 'file' }, new CompleteHeaderProvider(), '{'))
    
    // Text formatter functions
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.tableformatter' , () => {tableFormatterCommand()}))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.textBold'       , () => {latexTag  ('textbf');}))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.textEmph'       , () => {latexTag  ('emph'  );}))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.textGt'         , () => {latexTag  ('gt'    );}))

    // Custom table navigation
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.cursorMoveLeft'           , async () => {moveCursor('left' ); }))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.cursorMoveRight'          , async () => {moveCursor('right'); }))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.cursorMoveUp'             , async () => {moveCursor('up')   ; }))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.cursorMoveDown'           , async () => {moveCursor('down') ; }))
    context.subscriptions.push(vscode.commands.registerCommand('tableformatter.selectTextBetweenBrackets', () => {selectTextBetweenBrackets()}))
}


// This method is called when your extension is deactivated
export function deactivate() {}