// ICMP helper functions

// http://www.faqs.org/rfcs/rfc1071.html
function internetChecksum(buf) {
    if (buf.length === 0)
        return 0;

    let sum = 0;

    // Based off of:
    // https://gist.github.com/bryc/8a0885a4be58b6bbf0ec54c7758c0841#file-ipv4-js
    for (let i = 0; i < buf.length; i += 2) {
        let digit = (buf[i] << 8) + buf[i + 1];
        sum = (sum + digit) % 65535;
    }

    // a bitwise method of carrying the bits:
    //while (sum >> 16) sum = (sum & 0xFFFF)+(sum >> 16);
    return (~sum) & 0xFFFF;
}


// Based off of:
// https://www.frozentux.net/iptables-tutorial/chunkyhtml/x281.html
export function createHeader() {
    const data = {
        type: 0x08,
        code: 0x00,

        identifier: 0xF00D,
        sequence: 0,

        payload: '',
        checksum: 0x00
    };


    const header = Buffer.alloc(8 + data.payload.length);

    header.writeUInt8(data.type, 0);
    header.writeUInt8(data.code, 1);

    // Set checksum to zero to compute later:
    header.writeUInt16BE(0x00, 2);

    header.writeUInt16LE(data.identifier, 4);

    header.write(data.payload, 8);

    // Compute checksum:
    data.checksum = internetChecksum(header);
    header.writeUInt16BE(data.checksum, 2);

    return header;

}

export function parseResponse(buffer){

   // TODO: Should we verify the checksum?
   const type = buffer.readUInt8(20);
   const code = buffer.readUInt8(21);

   return {
       type: type,
       code: code
   }

}
