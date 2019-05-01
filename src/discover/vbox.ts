// Request array of hosts from VirtualBox

/* vboxConfig
 *
 * Attempt to use vboxconfig to read out the IP addresses. Currently
 * experimental. Might work, might not, who knows. 
 *
 *
 */

import { DSHost } from '../shared/interfaces';
import { DSPEvents,DSPlugin } from '../dsPlugin';

import * as virtualbox from 'virtualbox';

// Your discovery plugin is implemented here
//
// EVENTS:
//
// emits: debug
//	Your plugin can emit any type. 
//
// emits: status
//	Your plugin can emit a DSPEvents.status message. String. This may be shown
//	to the user and can provide feedback. The UI is reponsible for rate
//	limiting, so the plugin may call this as many times as needed.
//
// emits: percentage
//	Your plugin can emit a DSPEvents.percentage message if it's progress is
//	known. This may be ignored by the UI.
//
// emits: error
//	Emitted on a fatal error. String. No other events are expected after this
//	event is emitted, and may be discarded by the pool or UI. 
//
// emits: host
//	Emitted when a new host is found.
//
//
// listens: stop
//	Optional to implement at this time. Instructs your discovery app to stop. 
//
// listens: start
//	Optional to implement at this time. Instructs your discovery app to start.
//
//
// returns: instance of self
export class vboxPlugin extends DSPlugin {

	constructor(){
		super();

		this.name = 'vboxPlugin';

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
		this._msg('starting virtualvox plugin');
		virtualbox.list(function list_callback(machines, error) {

			if (error) emit(error+'');  // Act on machines});




			Object.keys(machines).forEach(function (m) {
				msg('parsing ' + m); // key
				const mach= machines[m];
				var options = {
					vm: m,
					key: '/VirtualBox/GuestInfo/Net/0'
				};


				virtualbox.guestproperty.get(options, console.log);

			});


		});

	}
}

