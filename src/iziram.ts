import * as vscode from "vscode";
import {PEP} from './types/types';
/**
 * Fonction permettant d'écrire sur l'éditeur de texte à une position spécifique
 * @param text Le texte à écrire
 * @param position La position à laquelle écrire (le curseur si non spécifiée)
 */
export function enterText(text: string, position?: vscode.Position) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            if(position){
                editBuilder.insert(position, text);
            }else{
                editBuilder.insert(editor.selection.active, text);
            }
           
        });
    }
}

/**
 * Cette fonction permet de récupperer une définition de fonction python sous la forme d'une chaine de caractère supportant la norme PEP8
 * @returns un objet PEP ou undefined
 */
export function getPEP8Definition() : PEP | undefined{
    const editor = vscode.window.activeTextEditor;
    if(editor){
        let process : boolean = true;
        let num = editor.selection.active.line;
        const startLine : string = editor.document.lineAt(num).text;
        let finalString : string = "";

        while (process && startLine.trimStart().startsWith("def")){
            const line : string = editor.document.lineAt(num).text;
            if(line.trim().endsWith(":")){
                process = false;
            }else{
                num++;
            }
            finalString += line;
        }
        return {
            "line": num+1,
            "string": finalString
        };
    }

    return undefined;
}

export function getParameterLine() : string{
    let value = "";
    const editor = vscode.window.activeTextEditor;
    if(editor){
        value = editor.document.lineAt(editor.selection.active.line).text.trim();
    }
    return value;
}

export function getFileName(path: string) : string{
    let value = "";
    let i = path.length -1 ;
    while (i >=0){
        const c = path[i];
        if(c !== "\\" && c !== "/"){
            value = c+value;
        }
        else{
            break;
        }
        i--;
    }
    return value;
}