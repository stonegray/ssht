import sshconfig from "ssh-config";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const run = async () => {

	// get home
	const homedir = require('os').homedir();
  let p = path.resolve("~/.ssh/config");
  const res = await fs.promises.readFile(p);
  console.log(res);
};

run();
