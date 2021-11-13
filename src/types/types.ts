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
