#!/user/bin/python -tt

import os
import xml.etree.ElementTree as ET
import requests

BASEDIR = '.'
TestXmlFilePath = BASEDIR + '/Tests/tbd/'
xmlext = '.xml'
urlHeader = 'http://10.223.1.88/Carmel-Versions/SVN/Builds/prod/'
buildVer = '8.7.5'
buildSubdir = 'trunk'
buildSuffix = '.bin'
delem = '/'
url = urlHeader + buildVer + delem + buildSubdir + delem

def getTestXml(file):
	print( TestXmlFilePath + file + xmlext)
	return (file)
	#return (TestXmlFilePath + file + xmlext)

def isavailable(file):
	if os.path.isfile(file):
		return True
	return False

def getopts(argv):
	opts = {}
	while argv:
		if argv[0][0] == '-': # found a "-name value" pair.
			opts[argv[0]] = argv[1] # add key and value to the dictionary
		argv = argv[1:] #  reduce the arg list, copyit from 1
	# all the arguments that we know of must be initialized
	if '-r' not in opts or opts['-r'] not in  ['Yes','yes','Yes']:
		opts['-r'] = False
	elif opts['-r'] in ['YES','yes']:
		opts['-r'] = True

	return opts

def printusage():
	print ('Try: ./runTest.sh -f <testname> -r <yes/no>')

def getXmlElem(file):
	tree = ET.parse(file)
	root = tree.getroot()
	elements = {}	
	elements['name']		=	root.attrib['id']
	elements['duration']	=	root.find('DURATION').text
	elements['time']		=	root.find('SCHEDULE_TIME').text
	elements['date']		=	root.find('SCHEDULE_DATE').text
	elements['recurrence']	=	root.find('RECURRENCE').text
	elements['RmxIp']		=	root.find('RMX_IP').text
	elements['RmxBuild']	=	root.find('RMX_BUILD').text
	elements['RmxType']		=	root.find('RMX_TYPE').text
	elements['RmxUser']		=	root.find('RMX_USER').text
	elements['RmxPass']		=	root.find('RMX_PASS').text
	elements['RmxSuPass']		=	root.find('RMX_SU_PASS').text
	elements['DmaIp']		=	root.find('DMA_IP')
	elements['FR']			=	root.find('FR')
	elements['SippIp1']		=	root.find('SIPP_PRIMARY').text
	elements['SippIp2'] 	= 	root.find('SIPP_SECONDARY').text
	elements['testType']	=	root.find('TEST_TYPE').text
	elements['videoType']	=	root.find('VIDEO_TYPE').text
	elements['protocol']	=	root.find('PROTOCOL').text
	elements['onFailRestart']	=	root.find('ON_FAIL_RESTART').text
	elements['emailTo']		=	root.find('EMAILTO').text
	print (elements)
	return elements

def buildavailable(build):
	global url
	url1 = url + build + delem + 'BL_names.txt'
	print (url1)
	resp = requests.get(url1)
	if resp.status_code == 200:
		buildName = resp.text.split('\n')[0].split('=')[1].strip(' ')
		if buildName == build:
			return True
	else:
		raise ValueError ('ERROR: Couldnt contact jenkins')
	return False
