#!/usr/bin/python -tt

import subprocess

file=open('abcd.sh','w+')
file.write('#!/bin/bash\n')
file.write('echo "hello world" > ok\n')
file.close()

process=subprocess.Popen('chmod 777 abcd.sh',shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
(stdout, stderr) = process.communicate()


process=subprocess.Popen('./abcd.sh',shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
(stdout, stderr) = process.communicate()
