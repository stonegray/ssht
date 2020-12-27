// workers/add.js
import { expose } from "threads/worker"
import Fuse from 'fuse.js';

const cache = [];

debugger;

// Add a host to the local cache
function addHost(host){
  cache.push(host);
}

// Execute query:
function query(string){

  const options = {
    keys: ['name', 'username', 'fqdn', 'port', 'kind'],
    ignoreLocation: true,
    includeMatches: true,
    isCaseSensitive: false,
    tokenize: true,
  };

  const fuse = new Fuse(cache, options);

  const results = fuse.search(string);

  if (typeof results === 'undefined') return [];

  return [...results];
}


expose({
  addHost: addHost,
  query: query
})
