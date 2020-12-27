FROM ubuntu:20.04

RUN echo "Europe/Paris" >> /etc/timezone

RUN apt update && apt install -y software-properties-common &&\ 
    add-apt-repository ppa:katharaframework/kathara &&\
    apt update &&\
    apt install kathara -y


 
