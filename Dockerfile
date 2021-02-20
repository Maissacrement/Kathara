FROM node:15.9.0-alpine3.12

WORKDIR /kathara
COPY ./labscript /opt/labscript

RUN apk update && apk add bash xterm shadow zlib git py-pip gcc musl python3-dev musl-dev linux-headers iptables &&\
    git clone https://github.com/KatharaFramework/Kathara.git /opt/kathara &&\
    pip3 install -r /opt/kathara/src/requirements.txt && ls /home &&\
    echo -e "export PATH=${PATH}:/opt/labscript/\nalias kathara=/opt/kathara/src/kathara.py;export DISPLAY=:0" > /home/node/.bashrc

# echo "docker:x:1000:1001::/home/docker:/bin/bash" >> /etc/passwd &&\
# mkdir -p /home/docker &&\
# chown -R 1000:1001 /home/docker && usermod -a -G dockremap docker &&\
# echo "kathara lstart --noterminals" >> /home/docker/.bash_history
RUN cd /opt/labscript && npm i

WORKDIR /home/docker
RUN /opt/labscript/run
WORKDIR /home/docker/lab
COPY ./entrypoint /home/docker
RUN chmod +x /home/docker/entrypoint
ENTRYPOINT [ "/home/docker/entrypoint" ]
#CMD [ "/opt/kathara/src/kathara.py", "lstart" ]

#RUN useradd docker
#USER docker
#WORKDIR /home/docker
# RUN sed "s/\/bin\/*sh/\/bin\/bash/" /etc/passwd

