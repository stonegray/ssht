// UI2

import { DSPool } from './pool';
import ui from './ui';

const pool = new DSPool();

/* reminder:
 * {
 *	name,
 *	username
 *	fqdn,
 *	port,
 *	uuid,
 *	ssh,
 *	kind
 * }
 */

ui.on('search',(phrase)=>{
	const stream = pool.search(phrase, (list)=>{
		console.log(list);
	});
});


console.log('ok');
