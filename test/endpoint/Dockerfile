FROM ubuntu:18.04

RUN apt-get update && apt-get install -y openssh-server netcat
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22
CMD /usr/sbin/sshd -D && sleep 192323

# Run docker build -t ssht-gw .
