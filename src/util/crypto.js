import { createHmac, Hmac } from 'crypto';
import { sn } from '@tib/sn';
import assert from 'assert/strict';

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
