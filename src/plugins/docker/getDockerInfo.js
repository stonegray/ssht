import Docker  from 'dockerode'



/*
Example
//protocol http vs https is automatically detected
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var docker1 = new Docker(); //defaults to above if env variables are not used
var docker2 = new Docker({host: 'http://192.168.1.10', port: 3000});
var docker3 = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
var docker4 = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http
 
var docker5 = new Docker({
  host: '192.168.1.10',
  port: process.env.DOCKER_PORT || 2375,
  ca: fs.readFileSync('ca.pem'),
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  version: 'v1.25' // required when Docker >= v1.13, https://docs.docker.com/engine/api/version-history/
});
 
var docker6 = new Docker({
  protocol: 'https', //you can enforce a protocol
  host: '192.168.1.10',
  port: process.env.DOCKER_PORT || 2375,
  ca: fs.readFileSync('ca.pem'),
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
});

*/

// async wrapper for Dockerode:
export async function getContainers(options) {

    return new Promise((resolve)=> {

        const docker = new Docker(options);
    
        docker.listContainers(function (err, containers) {
            resolve({
                err: err,
                containers: containers
            })
        });

    });
}

// async wrapper for Dockerode:
export async function getNetworks(options) {

  return new Promise((resolve)=> {

      const docker = new Docker(options);
  
      docker.listNetworks(function (err, networks) {
          resolve({
              err: err,
              networks: networks
          })
      });

  });
}

// async wrapper for Dockerode:
export async function getInfo(options) {

  return new Promise((resolve)=> {

      const docker = new Docker(options);
  
      docker.info(function (err, info) {
          resolve({
              err: err,
              info: info
          })
      });

  });
}