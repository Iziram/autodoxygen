// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as izi from "./iziram";
import * as proc from "./processing/function";
import { Lang, PEP } from './types/types';
import { ParamMemory } from './processing/remembering';
import { getLang } from './lang/lang';

export function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration('autodoxygen');

	let memory : ParamMemory | undefined = undefined;
	if(configuration.get('memoire')){
		memory = new ParamMemory();
	}
	const l = configuration.get("language") as string ;
	let lang : Lang;
	if(l){
		lang = getLang(l) as Lang;
	}

	//Création de la commande pour générer la docstring DoxyGen au début du fichier
	const disposable = vscode.commands.registerCommand('autodoxygen.commentFile', () => {

		//vérifie que l'éditeur est bien selectionné
		const editor = vscode.window.activeTextEditor;
		if(editor){
			//affichage du placeholder de la docstring
			let string : string = '"""! @brief ['+lang.principale.desc+']\n';
			string += " @file "+izi.getFileName(editor.document.uri.fsPath) + "\n";
			string += " @section libs Librairies/Modules\n";
			string += "  - ["+lang.principale.module+"] ("+lang.principale.link+")\n\n";
			string += " @section authors "+lang.principale.auth+"\n";
			const d : Date = new Date();
			const date : string  = d.toLocaleDateString();
			const a  = configuration.get("author") as string; 
			string += "  - "+lang.principale.create.replace('%auteur%', a).replace('%date%',date)+" .\n";
			string += '"""\n';
			izi.enterText(string, new vscode.Position(0,0));
		}
	});

	const saveParameter = vscode.commands.registerCommand('autodoxygen.saveParamDescription', ()=>{
		if(configuration.get('memoire.autorisation')){
			const parameter = proc.getParamDescription(izi.getParameterLine());
			if(parameter){
				memory?.saveParameter(parameter);
				vscode.window.showInformationMessage(lang.notification.saved.replace('%name%',parameter.name));
			}else{
				vscode.window.showErrorMessage(lang.notification.syntaxError);
			}
			
		}else{
			vscode.window.showErrorMessage(lang.notification.authError);
		}
	});

	//Création de la commande pour générer la docstring Doxygen d'une fonction
	const getText = vscode.commands.registerCommand("autodoxygen.commentFunction", ()=>{

		//vérifie que l'éditeur est bien selectionné
		const editor = vscode.window.activeTextEditor;
		if(editor){
			//récupération de la définition de la fonction (supporte PEP8)
			const pep : PEP | undefined = izi.getPEP8Definition();
			//écriture de la docstring Doxygen générée à partir de la ligne selectionnée

			

			if(pep){
				izi.enterText(
					proc.generateDocString(
						proc.generateDefinition(pep.string,l), memory,l)
						, new vscode.Position(pep.line, 0));
			}
		}
	});

	const doAll = vscode.commands.registerCommand('autodoxygen.commentAllFile',()=>{
		const editor = vscode.window.activeTextEditor;

		if(editor){
			let i = -1;
			const bigComments : number[] = [];
			while (i < editor.document.lineCount - 1){
				i++;
				const line =  editor.document.lineAt(i).text.trimStart();
				if(!bigComments.includes(2) && (line.startsWith('"""') || line.endsWith('""""')) ){
					if(bigComments.includes(1)){
						bigComments.splice(bigComments.lastIndexOf(1), 1);
					}else{
						bigComments.push(1);
					}
					continue;
				}else if(!bigComments.includes(1) && (line.startsWith("'''") || line.endsWith("'''"))){
					if(bigComments.includes(2)){
						bigComments.splice(bigComments.lastIndexOf(2), 1);
					}else{
						bigComments.push(2);
					}
					continue;
				}
				if(izi.checkStartOfLine(line) && bigComments.length === 0){
					setTimeout(()=>{
						const pep : PEP | undefined = izi.getPEP8Definition(izi.getLineOfDef(line));
						if(pep){
							izi.enterText(
								proc.generateDocString(
									proc.generateDefinition(pep.string, l), memory, l)
									, new vscode.Position(pep.line, 0));
						}
					}, i*10);
				}
			}
		}
	});

	context.subscriptions.push(disposable, getText, saveParameter, doAll);
	
}