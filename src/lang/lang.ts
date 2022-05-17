import { Lang } from "../types/types";

const langs = new Map();
langs.set('français', JSON.parse(`{
    "principale":{
        "desc": "description du fichier",
        "auth" : "Auteur(s)",
        "module" : "Nom du module",
        "link" : "lien",
        "create" : "Créé par %auteur% le %date%"
    },
    "notification":{
        "saved" : "Le paramètre %name% a bien été sauvegardé.",
        "syntaxError" : "Erreur: La ligne sélectionnée ne respecte pas la syntaxe des paramètres",
        "authError" : "Vous n'avez pas autorisé la sauvegarde des paramètres. Veuillez le faire avant d'essayer de sauvegarder un paramètre"
    },
    "fonction":{
        "summary" : "Description de la fonction",
        "paramTitle" : "Paramètres",
        "params" : "description",
        "returnTitle" : "Retour de la fonction",
        "returns" : "description"
    },
    "class":{
        "summary" : "Description de la classe",
        "paramTitle" : "Héritage",
        "params" : "description"
    }
}`) as Lang);
langs.set('english', JSON.parse(`{
    "principale":{
        "desc": "File's Description",
        "auth" : "Author(s)",
        "module" : "Module's name",
        "link" : "link",
        "create" : "Created by %auteur% on %date%"
    },
    "notification":{
        "saved" : "The parameter %name% has been successfully saved",
        "syntaxError" : "This line doesn't use the parameter syntax. ( @param name [: type = value] => description )",
        "authError" : "The memory settings are disabled. Turn them on before using this command."
    },
    "fonction":{
        "summary" : "Function's description",
        "paramTitle" : "Parameters",
        "params" : "description",
        "returnTitle" : "Returns",
        "returns" : "description"
    },
    "class":{
        "summary" : "Class's description",
        "paramTitle" : "Inheritances",
        "params" : "description"
    }
}`) as Lang);



export function getLang(lang: string) : Lang | undefined{
    return langs.get(lang);
}

