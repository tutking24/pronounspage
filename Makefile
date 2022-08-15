include .env.dist
-include .env

KEYS_DIR=./keys

install:
	-cp -n .env.dist .env
	if [ ! -d "${KEYS_DIR}" ]; then mkdir -p ${KEYS_DIR}; openssl genrsa  -out ${KEYS_DIR}/private.pem 2048; openssl rsa -in ${KEYS_DIR}/private.pem -outform PEM -pubout -out ${KEYS_DIR}/public.pem; fi
	mkdir -p moderation
	touch moderation/sus.txt moderation/rules-users.md moderation/rules-terminology.md moderation/rules-sources.md
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
	echo "\nimportScripts('https://arc.io/arc-sw-core.js');" >> static/sw.js
	ln -sfn ../data/img ./static/img-local
	ln -sfn ../data/docs ./static/docs-local

switch:
	rm -rf cache
	ln -sfn ./locale/${LANG} ./data
	ln -sfn ../locale/${LANG}/img ./static/img-local
	ln -sfn ../locale/${LANG}/docs ./static/docs-local

migrate:
	node server/migrate.js
