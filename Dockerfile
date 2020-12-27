FROM maissacrement/subnetting

# RUN echo "Europe/Paris" >> /etc/timezone

# RUN apt update && apt install -y software-properties-common &&\
#    add-apt-repository ppa:katharaframework/kathara &&\
#    apt update &&\
#    apt install kathara nodejs npm xterm -y

#COPY ./labscript /opt/labscript
#RUN cd /opt/labscript &&\
#    npm i && chmod +x /opt/labscript/run &&\
#    ln -s /usr/bin/node /usr/local/bin/node &&\
#    alias labscript=/opt/labscript/run
