# ssht

SSH Helper Tool

`ssht` is a powerful tool for frequent SSH users. It provides a lighting-fast search of all hosts you can connect to. Extensible plugins automatically discover them across your network, virtualization platforms, the cloud, and more. 

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

#### Comments
While `ssh_config` has no standard for host-specific comment fields, **ssht** interprets comments directly before a `Host` entry to be assosciated with that particular host (or glob), unless a comment is present below, in which case that will be used instead.
```ssh-config
# My web server
Host webserver
    # This will be used instead of the above if it's present
    Hostname webserver.example.org
    Port 2022
    User web-user
    Include ~/.ssh/aws_config
```

### Docker

If you have Docker running on your local machine, `ssht` will instantly discover all running containers that support SSH.  

If the Docker container is inaccessible, `ssht` will analyze the network and automagically configure SSH's [ProxyCommand](https://man.openbsd.org/ssh_config#ProxyCommand) option to properly route the connection to the container. 




