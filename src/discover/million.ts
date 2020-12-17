// New discovery plugin definition


import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';
import * as randomWords from 'random-words';



/* millionPlugin
 *
 * millions the pool with 10k hosts. Stress testing tool. 
 * Designed to show that ssht can handle large deployments.
 */


export class millionPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'millionPlugin';

		// Bind events:
		this.on(DSPEvents.start, this._start.bind(this));
		// Return the name of the plugin.
	}

	// Emit status and debug messages. Status messages are limited to String,
	// however debug messages can contain anything. They will likely be
	// serialized before writing to a file. 
	private _msg(msg: string){
		this.emit(DSPEvents.status, msg);
	}
	_debug(msg: any){
		this.emit(DSPEvents.debug, msg);
	}i
	_percentage(msg: number){
		this.emit(DSPEvents.percentage, msg+0);
	}

	// This is the main function of your plugin.
	_start(debug){

		const msg = this._msg.bind(this);
		const emit = this.emit.bind(this);
		// write to UI:
		msg('starting million plugin');

		let count = 0;

		const genHost = ()=>{
			count++;
			const host:DSHost = {
				name: randomWords(2).join('-'),
				fqdn: randomWords(3).join(),
				uudd: 'million',
				ssh: ''
			};
			this.emit(DSPEvents.host, host);

			if (count > 1e4) {
				msg('done');
				return;
			}

			if (count % 45 == 0){
				setTimeout(genHost,0);
			} else {
				setImmediate(genHost);
			}
		};

		genHost();
		// Generate random hosts to add:
	}
}



