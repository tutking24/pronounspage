include .env.dist
-include .env

KEYS_DIR=./keys

install:
	-cp -n .env.dist .env
	if [ ! -d "${KEYS_DIR}" ]; then mkdir -p ${KEYS_DIR}; openssl genrsa  -out ${KEYS_DIR}/private.pem 2048; openssl rsa -in ${KEYS_DIR}/private.pem -outform PEM -pubout -out ${KEYS_DIR}/public.pem; fi
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
