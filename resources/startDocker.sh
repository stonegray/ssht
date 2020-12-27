#!/bin/bash

# password is root

sudo docker run -d -P --name test_sshd rastasheep/ubuntu-sshd:14.04
sudo docker port test_sshd 22


command docker exec -it <container name>