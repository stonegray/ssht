import { createHmac, Hmac } from 'crypto';
import assert from 'assert/strict';

import { sn } from '@tib/sn';

let uuid = false;

// Hash a string, unique to the machine. 
export async function machineUniqueHMAC(string){

	if (uuid == false) uuid = await sn();

	// Require 64 bits;
	assert.ok(uuid.length > 8, 'Insufficient machine identification entropy to secure cache.');

	return createHmac('sha256', uuid + 'stonegray/ssht')
		.update(string)
		.digest('hex');
}
