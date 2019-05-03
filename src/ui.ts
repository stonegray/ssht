// UI

import chalk from 'chalk';
import * as prompts from 'prompts';
import * as cp		from 'child_process';
import { DSPool } from './pool';


// single backtick; escaped
const commandPrefix: string = '\\';

// initialize host pool
const pool = new DSPool();

function genRow(h): string {
	const w = process.stdout.columns;

	let host: string = h.fqdn;


	/* When insert color codes into the string, they're nonpriting, but take up
	 * a number of characters within the string. So, for a temporary hack to
	 * prevent line length issues, we just decrement counter whenever we use it,
	 * and this counter is an offset when we build the final line string.
	 *
	 * Some (line.len > process.stdout.width) sorta thing might also not be a
	 * bad idea
	 */
	let lengthOffset: number = 0;
	// const chalk = { gray: a => a };

	// If the device has a specified port, append it
	if (typeof h.port !== 'undefined') {
		host += chalk.gray(':' + h.port);
		lengthOffset -= 10;
	}

	if (typeof h.username !== 'undefined') {
		host = chalk.gray(h.username + '@') + host;
		lengthOffset -= 10;
	}

	const endText = '' + ( h.kind || '' );
	const instertAt = (str, sub, pos) => {
		return `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
	};

	// TODO: This is ugly:
	return instertAt(
		`${h.name} (${host})`.padEnd(w + w),
		endText,
		w - endText.length - lengthOffset
	).substring(0, w - lengthOffset); // logs 'I want an apple'
}

async function getChoices(arr) {
	// Get hosts list:
	const ch = [];

	arr.forEach(h => {
		// rearrange and format hosts

		ch.push({
			title: genRow(h),
			value: '' + arr.indexOf(h)
		});
	});

	return ch;
}

let lastUpdated:number = Date.now();

const suggestByTitle = (input, choices) => {

	let wasUpdated = false;

	// refresh match array:
	if (typeof choices.length !== 'undefined'){
		if (pool.hosts.length > choices.length){
			choices = genMatchArray(pool.hosts);
			wasUpdated = true;
		}
	}



	// Figure out what the multiple searches are:
	const searches = input.split(' ');
	// Main search filtering function:
	const search = (i, searches): boolean => {

		let doesMatch = 0;

		searches.forEach(s => {
			// Modify search before comparing:
			s = s.replace(/`/, '');


			if (typeof i.title === 'undefined') return;
			if (i.title.includes(s)) {
				doesMatch++;
			}
		});

		return doesMatch >= searches.length;
	};

	// Return the promise
	return Promise.resolve(
		// Filter choices by matching function:
		choices.filter(i => {
			return search(i, searches);
		})
	);
};

function genMatchArray(arr){

	const output = [];
	arr.forEach(i=>{
		output.push({
			title: genRow(i),
			value: '' + arr.indexOf(i)
		});
	});

	return output;
}

// main function:
(async () => {
	const arr = [];


	const availableHosts = {
		title: 'Start typing to search hosts. New hosts will appear as they are discovered.',
		value: -1
	};
	// Start autocomplete prompt:
	const response = await prompts([
		{
			type: 'autocomplete',
			name: 'index',
			message: 'Select host',
			suggest: suggestByTitle,
			choices: availableHosts
		}
	]);

	const index = response.index;

	process.stdout.write(''.padEnd(process.stdout.columns));
	process.stdout.write('\x1B[2A');
	process.stdout.write(''.padEnd(process.stdout.columns));
	console.log();

	if (index == null) {
		console.log(chalk.red('Unable to locate that host.'));
		process.exit(1);
		return;
		
	}

	if (index > pool.hosts.length ){
		console.error(chalk.red('Internal database failure. Index out of bounds.'));
		console.error('Please report this error on the issue tracker.');
		process.exit(2);
	}
	
	// get the record that the user requested
	const target = pool.hosts[index];
	
	// Get plugin name for debugging:
	let p: string = 'Unknown';
	if (typeof target === 'undefined'){
		console.error(chalk.red('Internal error. No entry at index '+index));
		console.error('Please report this error on the issue tracker.');
		process.exit(3);
	}
	if (typeof target.kind === 'string'){
		p = target.kind;
	} 

	console.error('State: ',{
		index: index,
		size: pool.hosts.length
	});
	console.error('Record: ', target);


	console.error(chalk.red('Plugin failure in discovery plugin "'+p+'": Missing or malformed SSH parameter.'));
	console.error(chalk.red('The current state is displayed above. Please include this your report.'));

	const childProcess = cp.spawn('ssh', [target.ssh], { stdio: 'inherit' });

	childProcess.on('error', (e)=>{
		process.stdout.write(e+'');

		process.stderr.write('ssht: A fatal error has occured. Exiting.');
	});
	childProcess.on('close', process.exit);

})();



//
