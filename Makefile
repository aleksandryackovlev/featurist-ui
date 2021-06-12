.PHONY: all install clone-api start-dev-app start

all: start

start: | clone-api install start-dev-app

start-dev-app:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ up app-dev

install:
	NODE_ENV=development docker-compose -f tools/docker/docker-compose.yml --project-directory ./ run --rm app-install

clone-api:
	./bin/git-get-code -d api -r git@github.com:aleksandryackovlev/featurist.git
