#!/usr/bin/python -tt

import subprocess

def main():
	process = subprocess.Popen('nohup ./test.sh &', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout,stderr) = process.communicate()

main()
