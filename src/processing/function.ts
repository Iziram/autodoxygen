import * as types from '../types/types';

function remove(mainText : string, toRemove: string) : string{
    mainText = mainText.replace(toRemove, "");
    return mainText;
}

function splitDefinition(definition : string){
    
    const head = definition.substring(0, definition.indexOf("("));
    const param =  definition.substring(definition.indexOf("(")+1, definition.indexOf(")"));
    const retour = definition.substring(definition.indexOf(")")+1, definition.lastIndexOf(":"));
    const tab = definition.substring(0,definition.indexOf("d"));
    return {
        title: head.replace("def ", "").replace(tab,""),
        param: param,
        tab : tab,
        return: retour
    };
    
}

function getParams(text : string) : types.Parameter[] {
    const array : string[] = text.split(",");
    const params : types.Parameter[] = [];
    array.forEach((value)=>{
        if(value !== ""){
            params.push(generateParam(value));
        }
        
    });
    return params;
}

function generateParam(text : string) : types.Parameter{
    let param : types.Parameter = {
        name: '',
    };
    const arr = [];
    let word : string = "";
    for(let i = 0; i<text.length; i++){
        if(text[i] === ":" || text[i] === "="){
            arr.push(word);
            word = "";
        }else{
            if(text[i] !== " "){
                word += text[i];
            }
        }
    }
    arr.push(word);

    switch(arr.length){
        case 3:
            param.name = arr[0];
            param.type = arr[1];
            param.value = arr[2];
            break;
        case 2:
            param.name = arr[0];
            param.type = arr[1];
            break;
        case 1:
            param.name = arr[0];
            break;
    }
    return param;
}

function generateReturn(text : string) : string | undefined {
    const txt = remove(text, "->").trim();
    if(txt !== ""){
        return txt;
    }
    return undefined;
}

export function generateDefinition(textLine :string) : types.Definition | undefined{
    if(textLine.split(" ").includes("def")){
        const base : types.BaseDefinition = splitDefinition(textLine);
        return {
            "name": base.title,
            "tab": base.tab,
            "summary": "@brief Explication de la fonction",
            "params" : getParams(base.param),
            "return" : generateReturn(base.return)
        };
    }
    return undefined;
    
}

export function generateDocString(definition? : types.Definition) : string {
    const tab = "    ";
    let docstring : string = tab+`"""!\n`;
    if(definition){
        const tabulations : string = definition.tab + tab;
        docstring = definition.tab + docstring;

        docstring += tabulations + definition.summary + "\n\n";
        if(definition.params.length > 0) {
            docstring += tabulations + "Paramètre(s) : \n";
        }
        definition.params.forEach((param : types.Parameter)=>{
            docstring += tabulations + tab +"@param " + param.name;
            if(param.type){
                docstring += " : "+ param.type;
            }
            if(param.value){
                docstring += " = "+ param.type;
            }
            docstring += " => [description]\n";
        });
        if(definition.return) {
            docstring += tabulations + "Retour de la fonction : \n";
            docstring += tabulations + tab + "@return " +definition.return + " [Description]\n";
        }
       
        
        return docstring +'\n'+tabulations+'"""\n';
    }
    return docstring + '\n'+tab+'"""\n';
}