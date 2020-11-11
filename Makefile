#!make
DOCKER:= docker
NAME=kathara
REPOSITORY=docker.io/maissacrement

build:
	@${DOCKER} build -t ${NAME} .

run:
	@${DOCKER} run -it --rm ${NAME}

tag:
	@${DOCKER} tag ${NAME} ${REPOSITORY}/${NAME}

push: tag
	@${DOCKER} push ${REPOSITORY}/${NAME} 

pull: tag
	@${DOCKER} pull ${REPOSITORY}/${NAME} 


