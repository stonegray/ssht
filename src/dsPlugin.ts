import { EventEmitter } from 'events';



type IUnionType = symbol | string| DSPEvents;

// Define arguments passed to plugins
export interface PluginArgs {
	debug: boolean;
}

export enum DSPEvents {
	start = 'NONE',
	debug = 'DEBUG',
	status = 'STATUS',
	percentage = 'PERC',
	error = 'ERROR',
	host = 'HOST',
}


// Definition of an SSHTPlugin
export interface DSPlugin {
	on(event: IUnionType, listener: Function): this;
	emit(event: IUnionType, listener: any): boolean;
}

export class DSPlugin extends EventEmitter {
	constructor(){
		super();
		return;
	}
}
