import * as vscode from "vscode";
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