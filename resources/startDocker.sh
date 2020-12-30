#!/bin/bash

# password is root

sudo docker run -d -P --name test_sshd rastasheep/ubuntu-sshd:14.04
sudo docker port test_sshd 22

sudo docker run -d -P --name test_sshd_proxy rastasheep/ubuntu-sshd:14.04
