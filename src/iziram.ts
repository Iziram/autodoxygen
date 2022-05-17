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
export function getPEP8Definition(line? : number) : PEP | undefined{
    const editor = vscode.window.activeTextEditor;
    if(editor){
        let process : boolean = true;
        let num = editor.selection.active.line;
        if(line) {
            num = line;
        }
        const startLine : string = editor.document.lineAt(num).text;
        let finalString : string = "";

        while (process && checkStartOfLine(startLine.trimStart())){
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

export function getLineOfDef(definition : string) : number{
    let value : number = -1;
    const editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if(editor){
        for (let i = 0; i<editor.document.lineCount; i++){
            const line : string = editor.document.lineAt(i).text.trimStart();
            if(line === definition){
                value = i;
                break;
            }
        }
    }
    return value;
}
/**
 * 
 * @param startLine Le début de la ligne à commenter
 * @returns boolean Vrai si le début de la ligne correspond à un début de ligne commentable sinon Faux
 */
export function checkStartOfLine(startLine : string) : boolean {
    const possibleStart : string[] = [
        "def",
        "async def",
        "class"
    ];
    return possibleStart.some(el=>{return startLine.startsWith(el);});
}


export function getModules() : string[]{
    const modules :string[] = [];

    const editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if(editor){
        for (let i = 0; i<editor.document.lineCount; i++){
            const line : string = editor.document.lineAt(i).text.trimStart();
            if(line.startsWith('from') || line.startsWith('import')){
                //from nana import nini
                modules.push(line.split(' ')[1]);
            }
        }
    }
    console.log(modules);
    return modules;
}