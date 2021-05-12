
import cp from 'child_process';


// x-man-page://ssh
const options = {
	family: 0, //4,6
	bind: {
		interface: undefined, //B
		address: undefined, //b  
	},
	logFile: undefined, // e
	print: false, // g
	user: undefined, // l
	sshOption: undefined, //o
	port: undefined, //p
};




function spawnSSH(options){

	// Drop listeners for command keys:
	process.stdin.removeAllListeners();

	const childProcess = cp.spawn('ssh', ['saffron.stonegray.ca'], { stdio: 'inherit' });


}


spawnSSH();