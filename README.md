# ssht

SSH Helper Tool

[![npm](https://img.shields.io/npm/v/ssht)](https://www.npmjs.com/package/ssht)
![Lines of code](https://img.shields.io/tokei/lines/github/stonegray/ssht)
![NPM](https://img.shields.io/npm/l/ssht)
![node-current](https://img.shields.io/node/v/ssht)
<!--[![npm](https://img.shields.io/npm/dt/ssht)](https://www.npmjs.com/package.ssht)-->


`ssht` is a powerful tool for frequent SSH users. It provides a lighting-fast search of all hosts you can connect to. Extensible plugins automatically discover them across your network, virtualization platforms, the cloud, and more. 

> ssht is currently unstable, features and APIs are subject to change at any time. 

[gif]


## Features

* ***Host Status*** <br/>As you type, `ssht` will optionally collect host information like connectivity and ping, and show it along each search result, so you can quickly identify offline hosts.
* ***Fuzzy Search*** <br/>Can't spell? Type with your elbows? No problem. `ssht` uses fuzzy text searching to show you the best possible results even with spelling mistakes, missing, or duplicated letters.
* ***Fully Extensible*** <br/>Want to auto-discover your custom widgets across your network? Share a giant SQL database of hosts with your whole company? Integrate with your own SSH certificate authority? `ssht` has first-class support for custom discovery plugins, with a performant incremental-async API
* ***Dumb Fast*** <br/>Whether you've got a thousand or ten thousand hosts, `ssht` tears through huge search jobs using an efficient multithreaded search engine.
* ***Plug 'n Play*** <br/>Unless you need to setup access to cloud services, you probably don't need to configure anything. If you do, there's [tons](#options) of options to play with. Just `npm install` and go.

## Sources


`ssht` can detect hosts from a variety of sources. It comes with the following builtin plugins:

- SSH Config
- Docker



### SSH Config
This plugin reads your `~/.ssh/config` file.

It has full support for even the most advanced config files, with recursive parsing of `Include` directives, Bash-4.2 compatible globbing with globstar, and more.

This plugin uses optional multithreaded computational parsing to quickly resolves all of the globbed patterns (eg. `Host *.example.org`) and allow searching by the actual parameters, even in complex configuration files.


### Docker

If you have Docker running on your local machine, `ssht` will instantly discover all running containers that support SSH.  

If the Docker container is inaccessible, `ssht` will analyze the network and automagically configure SSH's [ProxyCommand](https://man.openbsd.org/ssh_config#ProxyCommand) option to properly route the connection to the container. 




