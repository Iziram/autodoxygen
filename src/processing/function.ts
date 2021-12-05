import * as types from '../types/types';
import * as vscode from 'vscode';
import { ParamMemory } from './remembering';
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

function getLastParamCharIndex(definition : string) :number{
    let value = -1;
    let echap : boolean = false;
    const brackets : string[] = [];
    for(let c = 0; c < definition.length ; c++){
        if(definition[c] === "\\"){
            echap = true;
            continue;
        }
        if(!echap && (definition[c] === getClosingCharacter(brackets[brackets.length - 1]))){
            brackets.pop();
            value = c;
            if (brackets.length === 0){
                break;
            }
        }
        else if(!echap && (definition[c] === "[" || definition[c] === "(" || definition[c] === "{" || (definition[c] === "\""))){
            brackets.push(definition[c]);
        }
       
        echap = false;
        
    }

    return value;
}

/**
 * Cette fonction transforme une définition de fonction au format txt en un objet 
 * @param definition la définition de fonction sous forme de chaine de caractère
 * @returns la définition de fonction sous la forme d'un objet séparant la définition en 4 parties
 */
function splitDefinition(definition : string) : types.BaseDefinition{
    
    const head = definition.substring(0, definition.indexOf("("));
    const lastChar : number = getLastParamCharIndex(definition);
    const param =  definition.substring(definition.indexOf("(")+1, lastChar);
    const retour = definition.substring(lastChar + 1 , definition.lastIndexOf(":"));
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

function getClosingCharacter(char : string) : string{
    let value = "";
    switch(char){
        case '[':
            value = ']';
            break;
        case '(':
            value = ')';
            break;
        case '{':
            value = '}';
            break;
        case '"':
            value = '"';
            break;
        case "'":
            value = "'";
            break;
        default:
            value ="";
            break;
    }
    return value;
}

/**
 * Cette fonction permet de séparer une chaine de caractères représantant les paramètres d'une fonction  en une liste de chaine de caractères
 * @param text une chaine de caractères représantant les paramètres d'une fonction
 * @returns une liste de chaine de caractères représantant chacune un paramètre particulier
 */
function splitParams(text: string) : string[]{
    const params : string[] = [];
    const brackets : string[] = [];

    let echap : boolean = false;
    let word : string = "";
    for(let c = 0; c < text.length ; c++){
        word += text[c];
        if(text[c] === "\\"){
            echap = true;
            continue;
        }
        if(!echap && (text[c] === getClosingCharacter(brackets[brackets.length - 1]))){
            brackets.pop();
        }else if(!echap && brackets.length === 0 && (text[c] === "[" || text[c] === "(" || text[c] === "{" || (text[c] === "\"") )){
            brackets.push(text[c]);
        }
        
        if(brackets.length === 0 && text[c] === ","){
            params.push(word.substring(0,word.length-1));
            word = "";
        }
        echap = false;
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

    let echap : boolean = false;
    const brackets : string[] = [];
    const arr = [];
    let word : string = "";
    let sep : string = "";

    for(let c = 0; c < text.length ; c++){
        if(text[c] === "\\"){
            echap = true;
            continue;
        }
        if(!echap && (text[c] === getClosingCharacter(brackets[brackets.length - 1]))){
            brackets.pop();
        }
        else if(!echap && (text[c] === "[" || text[c] === "(" || text[c] === "{" || (text[c] === "\""))){
            brackets.push(text[c]);
        }
        
        if (brackets.length === 0 && (text[c] === ":" || text[c] === "=")){
            arr.push(word.trim());
            sep += text[c];
            word = "";
        }else{
            word += text[c];
        }
        echap = false;
        
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
            "summary": "@brief [Description de la fonction]",
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
export function generateDocString(definition? : types.Definition, memory? : ParamMemory) : string {
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
	        const configuration = vscode.workspace.getConfiguration('autodoxygen');

            if(configuration.get('memoire.autorisation') && memory){
                const desc : types.ParameterDescription | undefined = memory.getSavedParameter(param.name);
                if(desc){
                    docstring += " => "+desc.description+"\n";
                }else{
                    docstring += " => [description]\n";
                }

            }else{
                docstring += " => [description]\n";
            }
        });
        if(definition.return) {
            docstring += tabulations + "Retour de la fonction : \n";
            docstring += tabulations + tab + "@return " +definition.return + " => [description]\n";
        }
       
        
        return docstring +'\n'+tabulations+'"""\n';
    }
    return docstring + '\n'+tab+'"""\n';
}

export function getParamDescription(text : string) : types.ParameterDescription{
    let param : types.ParameterDescription = {
        name: '',
        description: ""
    };

    let echap : boolean = false;
    const brackets : string[] = [];
    const arr = [];
    let word : string = "";
    let sep : string = "";

    for(let c = 0; c < text.length ; c++){
        if(text[c] === "\\"){
            echap = true;
            continue;
        }
        if(!echap && (text[c] === getClosingCharacter(brackets[brackets.length - 1]))){
            brackets.pop();
        }
        else if(!echap && (text[c] === "[" || text[c] === "(" || text[c] === "{" || (text[c] === "\""))){
            brackets.push(text[c]);
        }
        
        if (brackets.length === 0 && (text[c] === ":" || text[c] === "=" || text[c] === ">") && sep.indexOf(text[c]) === -1){
            arr.push(word.trim());
            sep += text[c];
            word = "";
        }else{
            word += text[c];
        }
        echap = false;
        
    }
    arr.push(word.trim());
    param.name = arr[0].replace("@param ", "");
    for (let i = 0; i<sep.length;i++){
        if( sep[i] === ">"){
            param.description = arr[i+1];
        }
    }
    return param;
}