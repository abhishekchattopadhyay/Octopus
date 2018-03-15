#!/salt/bin/python -tt
'''
Created on March 1, 2018
@author: achattopadhyay
'''
import os
import sys
import urllib
import requests
import subprocess
import xml.etree.ElementTree as ET

defaultUrl = 'http://10.223.1.88/Carmel-Versions/SVN/Builds/prod/'
defaultVersion = '8.7.5/'
defaultSubDir = 'trunk/'
defaultBuild = 'last/'
downloadDir = '/tmp'
userCfgFile = '/opt/mcu/mcms/Cfg/SystemCfgUser.xml'
rmxType = 'UNKNOWN'
installedVersion = 'UNKNOWN'
ninjaBuildName = 'RPCS1800_RMX_'
HWBuildName = 'RMX_'
buildPrefix = '.bin'
autoUpgrade = False
url = defaultUrl+defaultVersion+defaultSubDir+defaultBuild

def isOverLoad():
	'''
	Find the rmx usage.
	if Usage is high then issue warning	
	'''
	overload = False
	command = 'uptime'
	process = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('Error: Couldnt identify cpu load')
	else:
		load = ((stdout.strip('\n')).split('load average: ')[1]).split(',')
		for i in load:
			if float(i) >= 1:
				overload = True
				# place for generating faults
				break;
	return overload

def gotSpace():
	'''
	Find if the root partition has enough HDD left to 
	download the pacakge
	'''
	minSpace = 1.5
	spaceLeft = True
	command = 'df'
	arg1 =  '-hk'
	arg2 =  '/'
	process = subprocess.Popen([command, arg1, arg2], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	if process.returncode != 0:
		print ('Error: couldnt findspace left')
	else:
		diskLeft = (((stdout.split('\n')[len(stdout.split('\n'))-1]).strip(' ')).split(' '))[1]
		if float(diskLeft)/(1024*1024) < minSpace:
			spaceLeft = False
			# place for generating faults
	return spaceLeft

def getRmxType():
	'''
	identify the rmx type
	'''
	global rmxType
	command = 'cat'
	arg1 = '/opt/mcu/mcms/ProductType'
	process = subprocess.Popen([command, arg1], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	rmxType = stdout
	return rmxType

def getRmxVersion():
	'''
	identify the rmx version installed
	'''
	global installedVersion
	command = '/opt/mcu/mcms/Scripts/GetMCUVersion.sh'
	process = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	(stdout, stderr) = process.communicate()
	installedVersion = 'RMX_' + stdout.split('\n')[0]

def isAutoUpgradeEnabled():
	'''
	checks the user configuration PERF_RUN value
	if True, then auto upgrade is enabled
	'''
	global autoUpgrade
	global userCfgFile
	if not os.path.isfile (userCfgFile):
		# time to raise an alert
		autoUpdrade = False
	else: 
		tree = ET.parse(userCfgFile)
		root = tree.getroot()
		for child in  root[0]:
			if child.tag == 'CFG_PAIR' and child[0].text == 'MS_ENVIRONMENT':
				autoUpgrade = (child[1].text == 'YES')
				break
	
def preRun():
	''' 
	sets up the environemnt 
	identifies the rmx type and things like that
	'''
	getRmxType()
	getRmxVersion()
	if isAutoUpgradeEnabled() and gotSpace() and not isOverLoad():
		return True
	return True
	
def checkLastGoodBuild():
	''' checks the latest good build available in jenkins
	good build is a build which compiled well
	'''
	resp = requests.get(url + '/BL_names.txt')
	if resp.status_code == 200:
		return (resp.text.split('\n')[0].split('=')[1].strip(' '))
	return ''
def downloadFile(link, fileName):
	response = urllib.urlretrieve (link, '/tmp/Analytics/'+fileName)
	
def main():
	global rmxType
	global goodBuild
	global installedVersion
	if not preRun():
		exit()
	goodBuild = checkLastGoodBuild()
	print (rmxType)
	print (goodBuild)
	print (installedVersion)
	if goodBuild != installedVersion and goodBuild != '':
		print ('Case for upgrade')
		# identify the download package
		rmxType = 'RMX_4000'
		if rmxType in ['RMX_4000', 'RMX_2000']:
			downloadUrl = url + goodBuild + buildPrefix
			downloadFile (downloadUrl, goodBuild+buildPrefix)
		elif rmxType in 'Ninja':
			downloadUrl = url + ninjaBuildName + goodBuild + buildPrefix
			downloadFile (downloadUrl, ninjaBuildName + goodBuild + buildPrefix)
		
		
