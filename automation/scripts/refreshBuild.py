#!/usr/bin/python -tt
'''
created on 14th March 2018
@author: Abhishek Chattopadhyay
FName: upgradeRMX
'''

import os
import sys
import urllib
import requests
import subprocess
from sys import argv

urlHeader = 'http://10.223.1.88/Carmel-Versions/SVN/Builds/prod/'
buildVer  = '8.7.5'
buildSubdir = 'trunk'
defaultBuild = 'last'
downloadDir = '/tmp'
buildSuffix = '.bin'
delm = '/'
url = urlHeader + buildVer + delm + buildSubdir + delm
rmxType = ''
buildToDownload = ''

def getopts(argv):
	opts = {}
	while argv:
		if argv[0][0] == '-': # found a "-name value" pair.
			opts[argv[0]] = argv[1] # add key and value to the dictionary
		argv = argv[1:] #  reduce the arg list, copyit from 1
	print (opts)
	return opts

def gotSpace():
	'''
        Find if the root partition has enough HDD left to down the package
        '''
	minSpace = 1.5
	spaceLeft = True
	command = 'df'
	arg2 =  '/output'
	diskLeft = 1
	process = subprocess.Popen([command, arg2], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('Error: couldnt find space left')
	else:
		op = (stdout.split('\n')[1].split(' '))
		while '' in op:
			op.remove('')
		diskLeft = op[2]
	if float(diskLeft)/(1024*1024) < minSpace:
		spaceLeft = False
                # place for generating faults
	return spaceLeft

def determinelatestbuild():
	#determine latest build
	latestbuild = ''
	print ('checking: ' + url)
	resp = requests.get(url+'/BL_names.txt')
	if resp.status_code == 200:
		latestbuild = resp.text.split('\n')[0].split('=')[1].strip(' ')
	print ('latest available build :' + latestbuild)
	return latestbuild

def buildavailable(build):
	global url
	print ('global url :' + url)
	url1 = url + build + delm + 'BL_names.txt'
	print ('checking: ' + url1)
	resp = requests.get(url1)
	print (resp)
	if resp.status_code == 200:
		buildName = resp.text.split('\n')[0].split('=')[1].strip(' ')
		if buildName == build:
			return True
	else:
		#raise ValueError ('ERROR: Build doesnt exist')
		return False

def main(myargs):
	global rmxType
	global buildToDownload
	global url
	userbuild = 'default'

	#determine rmxType
	process = subprocess.Popen('cat /opt/mcu/mcms/ProductType',shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout,stderr) = process.communicate()
	try:
		rmxType = stdout.split('\n')[0]
	except:
		rmxType = stdout
	if rmxType not in ['RMX4000','RMX2000','NINJA']:
		raise ValueError ('ERROR: Couldnt identify rmx type')
	print ('rmx type: ' + rmxType)
	
	# determine desired build 
	try:
		if '-b' in myargs.keys():
			print (myargs.keys())
			userbuild = myargs['-b']
			print (userbuild)
			print (url+userbuild+delm)
			if userbuild != 'default':
				print ('user build is not default')
				if buildavailable(userbuild):
					url = url + userbuild + delm
				else:
					print ('Error: Not a good build')
					raise ValueError('Error: Not a good build')
			else:
				url += defaultBuild + delm
		else:
			userbuild = 'default'
			url += defaultBuild + delm
	except:
		raise ValueError ('ERROR: not sure of the build')
	print ('build by user: ' + userbuild)
	
	# determine the filename to download
	if userbuild == 'default':
		if rmxType == 'NINJA':
			buildToDownload = 'RPCS1800_' + determinelatestbuild() + '.bin'
		else:
			buildToDownload = determinelatestbuild() + '.bin'
	else:
		if rmxType == 'NINJA':
			buildToDownload = 'RPCS1800_' + userbuild + '.bin'
		else:
			buildToDownload = userbuild + '.bin'
	print ('build to download: ' + buildToDownload)

	'''
	#if  not gotSpace(): # determine space left but may be do it later
	#	pass
	#	print ('Error: No space on device')
	#	raise ValueError ('ERROR: No disk left')
	'''
	
	# determine the download path
	if rmxType == 'NINJA':
		downloadFilePath = '/output/' + buildToDownload
	else:
		downloadFilePath = '/tmp/' + buildToDownload
	print ('download path: '+ downloadFilePath)

	# configure the link
	link = url + buildToDownload
	print ('download link: ' + link)

	#download the package now
	print ('Now Downloading ' + link)
	response = urllib.urlretrieve (link, downloadFilePath)
	print ('Downloading Done\n Now Upgrading ')
	
	#remount the partition
	process = subprocess.Popen('mount -o remount,rw /data', shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('ERROR: couldnt remount /data as rw')
	else:
		print ('SUCCESS: remount /data as rw')
		
	process = subprocess.Popen('ll /data', shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	print (stdout)
	
	# move the build to the right partition
	process = subprocess.Popen('mv ' + downloadFilePath+ ' /data/', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('ERROR:	couldnt move downloaded .bin file to /data')
	else:
		print ('SUCCESS: moved .bin to /data')
		
	process = subprocess.Popen('ll /data', shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	print (stdout)

	# relink
	process = subprocess.Popen('cd /data; ln -sf ' + buildToDownload +' current', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('ERROR: couldnt recreate the link to the new .bin file in /data/current')
	else:
		print ('SUCCESS: relinked .bin')
	

	process = subprocess.Popen('ll /data', shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	print (stdout)
	
	# reboot
	process = subprocess.Popen('reboot', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
		
	#the end of tasks
	return

	
if __name__ == '__main__':
	sys.dont_write_bytecode = True
	myargs = getopts(argv)
	main(myargs)
	sys.exit(0)
