


export function hrtimeToMs(hrtime){

	let ns = hrtime[1];

	ns += hrtime[0] * 1e9;

	let millis = ns / 1e6;

	return millis;
}

// async equvillant of a setTimeout callback:
export async function asyncSleep(millis){
	return new Promise(resolve =>{
		setTimeout(resolve, millis);
	});
}