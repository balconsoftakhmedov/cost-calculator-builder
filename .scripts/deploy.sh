#!/usr/bin/env bash
set -xe;

scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -v -r \
	dist/${ARCHIVE} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/${ARCHIVE}
ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
	${DEPLOY_USER}@${DEPLOY_HOST} "set -xe;
	cd ${DEPLOY_PATH}/ &&
	unzip -o ${ARCHIVE} &&
	rm -f ${ARCHIVE}"
