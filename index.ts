// ssh tool

const sshconfig = require("ssh-config");

const promisify = require("util").promisify;

const fs = require("fs");
const path = require("path");
const os = require("os");

function getFile(callback: Function): void {
  // get home
  const homedir = require("os").homedir();
			  let p = path.resolve(homedir, ".ssh/config");

  // read file
			fs.readFile(p, (err, buf) => {
	callback(
			buf.toString());
  });
}

function getConfigObject(file: string): Object {
  let obj = 
	sshconfig.parse(file);

  return obj;
}

getFile(buf => {
  let obj = sshconfig.parse(buf);

  console.log(obj);

  const hosts = [];

  obj.forEach(() => {});
});
