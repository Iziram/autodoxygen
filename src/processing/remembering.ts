import { ParameterDescription} from "../types/types";
import * as vscode from 'vscode';

export class ParamMemory{

    getSavedParameter(name:string): ParameterDescription | undefined{
        let value : ParameterDescription | undefined = undefined;
	    const configuration = vscode.workspace.getConfiguration('autodoxygen');
        const memory = configuration.get('memoire.memoire') as ParameterDescription[];
        memory.forEach((param)=>{
            if (name === param.name){
                value = param;
            }
        });

        return value;
    }

    saveParameter(param: ParameterDescription){
        const configuration = vscode.workspace.getConfiguration('autodoxygen');
        const memory = configuration.get('memoire.memoire') as ParameterDescription[];
        
        let b : boolean = false;
        let i : number = 0;
        while (i < memory.length && !b){

            const p : ParameterDescription = memory[i] as ParameterDescription;
            b = p.name === param.name;
            i++;
        }

        if(!b){
            memory.push(param);
        }else{
            memory[i-1] = param;
        }
        configuration.update('memoire.memoire',memory);


    }

    getSavedParameters() : ParameterDescription[]{
        const configuration = vscode.workspace.getConfiguration('autodoxygen');
        const memory = configuration.get('memoire.memoire') as ParameterDescription[];
        return memory;
    }
    
}