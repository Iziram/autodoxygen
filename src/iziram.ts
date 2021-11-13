import * as vscode from "vscode";
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
 * Fonction qui récupère le texte de la ligne où se trouve le curseur
 * @returns string -> le texte contenu dans la ligne 
 */
export function getText() : string{
    let value : string = "";
    
    const editor = vscode.window.activeTextEditor;
    if (editor){
        let num = editor.selection.active.line;
        let line = editor.document.lineAt(num);
        value = line.text;
    }
    return value;
}