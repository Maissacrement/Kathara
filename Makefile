#!make
DOCKER:= docker
NAME=kathara
REPOSITORY=docker.io/maissacrement

build:
	@${DOCKER} build -t ${NAME} .

run: build
	@${DOCKER} run -it --name ${NAME} --rm --privileged -e DISPLAY=$(DISPLAY) \
	  -v "/tmp/.X11-unix/:/tmp/.X11-unix/" \
	  -v "/var/run/docker.sock:/var/run/docker.sock" \
	${NAME}

shell:
	@${DOCKER} exec -it ${NAME} chown -R root:dockremap /var/run/docker.sock
	@${DOCKER} exec -u docker -it ${NAME} /bin/bash

logs:
	docker logs ${NAME}

tag:
	@${DOCKER} tag ${NAME} ${REPOSITORY}/${NAME}

push: tag
	@${DOCKER} push ${REPOSITORY}/${NAME}

pull: tag
	@${DOCKER} pull ${REPOSITORY}/${NAME}

prod:
	@${DOCKER} run -it --rm -e DISPLAY=$(DISPLAY) \
	  -v "/tmp/.X11-unix/:/tmp/.X11-unix/" ${REPOSITORY}/${NAME}

#$(NAME):prod
$(NAME):build run
