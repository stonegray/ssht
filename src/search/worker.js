// workers/add.js
import { isMainThread } from "worker_threads";

// eslint-disable-next-line import/extensions
import { expose } from "threads/worker";
import Fuse from 'fuse.js';

let cache = [];

// Add a host to the local cache
function addHost(host){

  // Support ingesting arrays instead of individual hosts:
  if (Array.isArray(host)){
    cache = cache.concat(host);
    return;
  } 

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

function info(){

  return {
    cacheSize: cache.length
  };

}

const exposed = {
  addHost: addHost,
  query: query,
  info: info
};
if (!isMainThread){
  expose(exposed);
}
export default exposed;
