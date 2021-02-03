// Used for testing that top-level await is supported

async function foo(){
	return true;
}

await foo();


export default await foo();

