#!make
DOCKER:= docker
NAME=kathara
REPOSITORY=docker.io/maissacrement

build:
	@${DOCKER} build -t ${NAME} .

run:
	@${DOCKER} run -it --rm -e DISPLAY=$(DISPLAY) \
	  -v "/tmp/.X11-unix/:/tmp/.X11-unix/" ${NAME}

tag:
	@${DOCKER} tag ${NAME} ${REPOSITORY}/${NAME}

push: tag
	@${DOCKER} push ${REPOSITORY}/${NAME} 

pull: tag
	@${DOCKER} pull ${REPOSITORY}/${NAME} 

prod:
	@${DOCKER} run -it --rm -e DISPLAY=$(DISPLAY) \
	  -v "/tmp/.X11-unix/:/tmp/.X11-unix/" ${REPOSITORY}/${NAME}

$(NAME):prod


