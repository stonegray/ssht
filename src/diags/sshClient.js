import util from 'util';
import { exec } from 'child_process';



export async function getClientVersion() {

	const { stdout , stderr } = await util.promisify(exec)('ssh -V');

	return stderr;
}