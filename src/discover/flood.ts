// New discovery plugin definition


import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';
import * as randomWords from 'random-words';


/* floodPlugin
 *
 * Floods the pool with 10k hosts. Stress testing tool. 
 * Designed to show that ssht can handle large deployments.
 */


export class floodPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'floodPlugin';

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
		msg('starting flood plugin');


		let count = 0;

		const genHost = ()=>{
			count++;
			const rfqdn = ()=>{
				const tlds = [
					'.com','.org','.net','.ca','.foobar','.com.cn'
				];
				const i = ~~(Math.random()*tlds.length);
				const tld = tlds[i];
				if (tld === 'undefined') return;
				return tld;
			};
			const host:DSHost = {
				name: randomWords(2).join('-'),
				username: randomWords(),
				fqdn: `example${rfqdn()}`,
				port: ~~(Math.random()*65535),
				uudd: 'flood',
				ssh: '',
				kind: 'flood'
			};
			this.emit(DSPEvents.host, host);

			if (count > 1e3) {
				msg('done');
				return;
			}

			if (count % 5 == 0){
				setTimeout(genHost,0);
			} else {
				setImmediate(genHost);
			}
		};

		genHost();
		// Generate random hosts to add:
	}
}



