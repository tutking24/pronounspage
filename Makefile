install:
	yarn

run:
	yarn dev

start:
	node_modules/.bin/avris-daemonise start webserver yarn dev

stop:
	node_modules/.bin/avris-daemonise stop webserver

deploy: install
	yarn build
