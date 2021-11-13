// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { stringify } from 'querystring';
import * as vscode from 'vscode';
import * as izi from "./iziram";
import * as proc from "./processing/function";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('autodoxygen.commentFile', () => {
		const editor = vscode.window.activeTextEditor;
		if(editor){
			let string : string = '"""! @brief [description du fichier]\n';
			string += " @file "+ editor.document.fileName.substring(editor.document.fileName.lastIndexOf("\\") + 1 ) + "\n";
			string += " @section libs Librairies/Modules\n";
			string += "  - [Nom du module] (lien)\n\n";
			string += " @section authors Author(s)\n";
			string += "  - Créé par [Prénom] [Nom] le [Date] .\n";
			string += '"""\n';
			izi.enterText(string, new vscode.Position(0,0));
		}
	});

	let getText = vscode.commands.registerCommand("autodoxygen.commentFunction", ()=>{
		const editor = vscode.window.activeTextEditor;
		if(editor){
			izi.enterText(proc.generateDocString(proc.generateDefinition(izi.getText())), new vscode.Position(editor.selection.active.line+1, 0));
		}
	});

	context.subscriptions.push(disposable, getText);
	
}