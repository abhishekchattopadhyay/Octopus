#!/usr/bin/python -tt
'''
Created on March 1, 2018
@author: achattopadhyay
'''

import sys
import requests
import subprocess

defaultUrl = '/Carmel-Versions/SVN/Builds/prod/8.7.5/trunk/'
downloadDir = '/tmp'

def findRmxUsage():
	'''
	Find the rmx usage.
	if Usage is high then issue warning	
	'''
	command = 'uptime'
	process = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('didnt  work')
	else:
		print (stdout.split('\n'))
findRmxUsage()
	
