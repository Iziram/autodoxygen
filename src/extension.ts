// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as izi from "./iziram";
import * as proc from "./processing/function";
import { PEP } from './types/types';
import { ParamMemory } from './processing/remembering';

export function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration('autodoxygen');

	let memory : ParamMemory | undefined = undefined;
	if(configuration.get('memoire')){
		memory = new ParamMemory();
	}

	//Création de la commande pour générer la docstring DoxyGen au début du fichier
	let disposable = vscode.commands.registerCommand('autodoxygen.commentFile', () => {

		//vérifie que l'éditeur est bien selectionné
		const editor = vscode.window.activeTextEditor;
		if(editor){
			//affichage du placeholder de la docstring
			let string : string = '"""! @brief [description du fichier]\n';
			string += " @file "+izi.getFileName(editor.document.uri.fsPath) + "\n";
			string += " @section libs Librairies/Modules\n";
			string += "  - [Nom du module] (lien)\n\n";
			string += " @section authors Auteur(s)\n";
			const d : Date = new Date();
			const date : string = d.getDate()+"/"+(d.getMonth()+1) + "/"+d.getFullYear();
			string += "  - Créé par "+configuration.get('auteur')+" le "+date+" .\n";
			string += '"""\n';
			izi.enterText(string, new vscode.Position(0,0));
		}
	});

	let saveParameter = vscode.commands.registerCommand('autodoxygen.saveParamDescription', ()=>{
		if(configuration.get('memoire.autorisation')){
			const parameter = proc.getParamDescription(izi.getParameterLine());
			if(parameter){
				memory?.saveParameter(parameter);
				vscode.window.showInformationMessage("Le paramètre '"+parameter.name+"' a bien été sauvegardé.");
			}else{
				vscode.window.showErrorMessage("Erreur: La ligne sélectionnée ne respecte pas la syntaxe des paramètres");
			}
			
		}else{
			vscode.window.showErrorMessage("Vous n'avez pas autorisé la sauvegarde des paramètres. Veuillez le faire avant d'essayer de sauvegarder un paramètre");
		}
	});

	//Création de la commande pour générer la docstring Doxygen d'une fonction
	let getText = vscode.commands.registerCommand("autodoxygen.commentFunction", ()=>{

		//vérifie que l'éditeur est bien selectionné
		const editor = vscode.window.activeTextEditor;
		if(editor){
			//récupération de la définition de la fonction (supporte PEP8)
			const pep : PEP | undefined = izi.getPEP8Definition();
			//écriture de la docstring Doxygen générée à partir de la ligne selectionnée

			

			if(pep){
				izi.enterText(
					proc.generateDocString(
						proc.generateDefinition(pep.string), memory)
						, new vscode.Position(pep.line, 0));
			}
		}
	});

	context.subscriptions.push(disposable, getText, saveParameter);
	
}