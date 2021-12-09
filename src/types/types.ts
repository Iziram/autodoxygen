export interface Definition {
	name: string,
	summary: string,
	params: Parameter[],
	tab: string,
	return?: string
}

export interface BaseDefinition{
	title: string,
	tab : string,
	param: string,
	return: string
}

export interface Parameter{
	name : string,
	type? : string,
	value? : string
}
export interface ParameterDescription{
	name : string,
	description: string
}


export interface PEP{
	line: number,
	string: string
}

// Types pour les langages

export interface Lang{
	principale : DescriptionPrincipale,
	notification : Notifications,
	fonction : DescriptionFonction
}

export interface DescriptionPrincipale{
	desc : string,
	auth : string,
	module: string,
	link : string,
	create : string
}

export interface Notifications{
	saved : string,
	syntaxError : string,
	authError : string
}

export interface DescriptionFonction{
	summary : string,
	paramTitle : string,
	params : string,
	returnTitle: string,
	returns : string
}