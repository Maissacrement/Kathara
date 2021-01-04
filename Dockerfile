FROM maissacrement/subnetting

WORKDIR /kathara
COPY ./labscript /opt/labscript

RUN apk update && apk add npm bash nodejs xterm shadow &&\
    git clone https://github.com/KatharaFramework/Kathara.git /opt/kathara &&\
    pip3 install -r /opt/kathara/src/requirements.txt &&\
    echo "docker:x:1000:1001::/home/docker:/bin/bash" >> /etc/passwd &&\
    mkdir -p /home/docker &&\
    echo -e "export PATH=${PATH}:/opt/labscript/\nalias kathara=/opt/kathara/src/kathara.py" > /home/docker/.bashrc &&\
    chown -R 1000:1001 /home/docker && usermod -a -G dockremap docker &&\
    echo "kathara lstart --noterminals" >> /home/docker/.bash_history

RUN cd /opt/labscript && npm i

WORKDIR /home/docker

#RUN useradd docker
#USER docker
#WORKDIR /home/docker
# RUN sed "s/\/bin\/*sh/\/bin\/bash/" /etc/passwd

