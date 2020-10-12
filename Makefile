install:
	yarn
	node server/migrate.js

run:
	yarn dev

start:
	node_modules/.bin/avris-daemonise start webserver yarn dev

stop:
	node_modules/.bin/avris-daemonise stop webserver

deploy: install
	yarn build
	node server/migrate.js

switch:
	-rm data
	ln -s ./locale/${LANG} ./data
