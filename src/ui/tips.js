/* eslint-disable security/detect-object-injection */

const tips = [
	'Use meta+# to quick connect to a numbered result in the list',
	'Add a cron job with the --update option to speed up host discovery'
];

function getTip(){
	const index = Math.floor(Math.random() * tips.length);
    
	const tip = tips[index];

	if (typeof tip == 'function') return tip();
	return tips[index];
}

export default getTip;