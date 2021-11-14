import * as types from '../types/types';
/**
 * Cette fonction permet de retirer une chaîne de caractères dans une autre
 * @param mainText la chaine de caractère principale
 * @param toRemove la chaine de caractère à retirer de la chaine principale
 * @returns string la chaine de caractère principale sans la chaine à retirer
 */
function remove(mainText : string, toRemove: string) : string{
    mainText = mainText.replace(toRemove, "");
    return mainText;
}

/**
 * Cette fonction transforme une définition de fonction au format txt en un objet 
 * @param definition la définition de fonction sous forme de chaine de caractère
 * @returns la définition de fonction sous la forme d'un objet séparant la définition en 4 parties
 */
function splitDefinition(definition : string) : types.BaseDefinition{
    
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

/**
 * Cette fonction transforme une chaine de caractère représentant les paramètres d'une fonction en liste de d'objet Parameter
 * @param text une chaine de caractère représentant les paramètres d'une fonction
 * @returns liste de d'objet Parameter
 */
function getParams(text : string) : types.Parameter[] {
    const array : string[] = splitParams(text);
    const params : types.Parameter[] = [];
    array.forEach((value)=>{
        if(value !== ""){
            params.push(generateParam(value));
        }
        
    });
    return params;
}

/**
 * Cette fonction permet de séparer une chaine de caractères représantant les paramètres d'une fonction  en une liste de chaine de caractères
 * @param text une chaine de caractères représantant les paramètres d'une fonction
 * @returns une liste de chaine de caractères représantant chacune un paramètre particulier
 */
function splitParams(text: string) : string[]{
    const params : string[] = [];
    const brackets : number[] = [];

    let word : string = "";
    for(let c = 0; c < text.length ; c++){
        word += text[c];
        if(text[c] === "[" || text[c] === "(" || text[c] === "{"){
            brackets.push(1);
        }
        if(text[c] === "]" || text[c] === ")" || text[c] === "}"){
            brackets.pop();
        }
        if(brackets.length === 0 && text[c] === ","){
            params.push(word.substring(0,word.length-1));
            word = "";
        }
    }
    params.push(word);
    return params;
}

/**
 * Cette fonction génère un objet de type Parameter en fonction d'une chaine de caractère
 * @param text une chaine de caractère représentant un paramètre de fonction
 * @example text = "a:int = 5"
 * @example text = "a : int"
 * @example text = "a"
 * @returns un objet de type Parameter
 */
function generateParam(text : string) : types.Parameter{
    let param : types.Parameter = {
        name: '',
    };
    const arr = [];
    let word : string = "";
    let sep : string = "";
    for(let i = 0; i<text.length; i++){
        if(text[i] === ":" || text[i] === "="){
            arr.push(word.trim());
            sep += text[i];
            word = "";
        }else{
            word += text[i];
        }
    }
    arr.push(word.trim());
    param.name = arr[0];

    for (let i = 0; i<sep.length;i++){
        if( sep[i] === ":"){
            param.type = arr[i+1];
        }else if( sep[i] === "="){
            param.value = arr[i+1];
        }
    }
    return param;
}

/**
 * Cette fonction récupère les informations importantes 
 * d'une chaine de caractère représentant le retour de la fonction 
 * @param text une chaine de caractère représentant le retour de la fonction
 * @returns les informations importantes sous forme de string ou un undefined si il n'y a pas d'informations
 */
function generateReturn(text : string) : string | undefined {
    const txt = remove(text, "->").trim();
    if(txt !== ""){
        return txt;
    }
    return undefined;
}

/**
 * Cette fonction génère un objet Definition qui sera utilisé pour la docstring
 * @param textLine une chaine de caractère représantant une définition de fonction
 * @returns un objet Definition
 */
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

/**
 * Cette fonction permet de générer une docstring en fonction d'un objet Definition passé en paramètre
 * @param definition objet Definition
 * @returns La docstring doxygen correspondant à la définition
 */
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
                docstring += " = "+ param.value;
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