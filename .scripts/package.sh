#!/usr/bin/env bash
# The task is to create ZIP archive with BASE directory inside it.
#   file1.php => plugins-dir/file1.php
#   includes/file2.php => plugins-dir/includes/file1.php
#
# TO achieve this, the script will move necessary files into temporary created BASE directory
# and create archive from working directory.
# After finishing it returns files to their original place and removes temp directory

BASE=${1}
ARCHIVE=${2}

# This will create a list of entries in working directory
# and strip out unnecessary files and directories
files=$(ls -A | xargs)
files=${files//$BASE /}
files=${files//.scripts /}
files=${files//.git /}
files=${files//.gitignore /}
files=${files//node_modules /}

set -xe;

mkdir ${BASE} && \
mv ${files} ${BASE}/ && \
mkdir -p dist && \
zip -v
zip -r dist/${ARCHIVE} ./${BASE} \
	-x '*.git*' '*.scripts*' '*assets-wporg*' '*bitbucket*' '*webpack*' '*package*.json' '*node_modules*' '*.scss' '*assets/scss*' '*frontend/src*' && \
mv ${BASE}/* ./ && \
rm -r ${BASE}
