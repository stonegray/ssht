import { EventEmitter } from 'events';


// Need to use another type for an event? Add it as a union here:
type IUnionType = DSPEvents;



export enum DSPEvents {

	// Plugins listen for:
	start = 'START',
	stop = 'STOP',

	// Plugins emit:
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

