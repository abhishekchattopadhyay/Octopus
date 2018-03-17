#!/usr/bin/python -tt

'''
created on March 7, 2018
@author: achattopadhyay
FName: runTest
'''
from __future__ import print_function
import time
import os
import sys
from sys import argv
import subprocess
'''
usage
./runTest.sh -f <testXmlFileName> -r <yes/no> 
'''
class test:
	''' 
	defination of a test as configured by the user
	'''
	def __init__(self,elements):
		self.name			= 	elements['id']
		self.durationH		= 	elements['DURATION_H']
		self.durationM		= 	elements['DURATION_M']
		self.durationS		= 	elements['DURATION_S']
		self.rate			=	elements['RATE']
		self.recurrence		=	elements['RECURRENCE']	
		self.time			= 	elements['SCHEDULE_TIME']
		self.date			= 	elements['SCHEDULE_DATE']
		self.schd_policy	=	elements['SCHEDULE_POLICY']
		self.RmxIp			= 	elements['RMX_IP']
		self.RmxType		=	elements['RMX_TYPE']
		self.RmxBuild		= 	elements['RMX_BUILD']
		self.RmxUser		=	elements['RMX_USER']
		self.RmxPass		=	elements['RMX_PASS']
		self.RmxSuPass		=	elements['RMX_SU_PASS']
		self.DmaIp			=	elements['DMA_IP']
		self.Sipp1Ip		=	elements['SIPP_PRIMARY']
		self.Sipp1Usr		=	elements['SIPP_PRI_USR']
		self.Sipp1Pass		=	elements['SIPP_PRI_PASS']
		self.Sipp2Ip		=	elements['SIPP_SECONDARY']
		self.Sipp2Usr		=	elements['SIPP_SEC_USR']
		self.Sipp2Pass		=	elements['SIPP_SEC_PASS']
		self.testType		=	elements['TEST_TYPE']
		self.videoType		=	elements['VIDEO_TYPE']
		self.protocol		=	elements['PROTOCOL']
		self.FR				=	elements['FR']
		self.holdTime		=	elements['HOLDTIME']
		self.onFailRestart	=	elements['ON_FAIL_RESTART']
		self.emailTo		=	elements['EMAILTO']
		self.monitor_delay	=	elements['MONITOR_DEALY']

	def executeupgrade(self):
		'''
		upgradeRMX is an expect based script which 
		upgrades all RMXs based on the target version provided
		'''
		command = './scripts/upgradeRMX ' +  self.RmxIp + ' ' + self.RmxUser + ' ' + self.RmxPass + ' ' + self.RmxBuild
		print (command)
		process = subprocess.Popen(command, shell = True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
		(stdout, stderr) = process.communicate()
		print (stderr)
		if process.returncode != 0:
			return False
		return True	

	def runSipp(self):
		#here we'll have to check if one or two sipp is required
		# runSipp <sippIp> <username> <password> <dmaIp> <time <hr> <min> <sec>> <rate> <holdTime> <tcName> <1/2> <failureRate> <monitor_delay>
		command = './scripts/runSipp ' + self.Sipp1Ip + ' ' + self.Sipp1Usr + ' ' + self.Sipp1Pass  + ' ' + self.DmaIp + ' ' + self.durationH + ' ' + self.durationM + ' ' + self.durationS + ' ' + self.rate + ' ' + self.holdTime + ' ' + self.name + ' ' + self.testType + ' ' + self.FR + ' ' + self.monitor_delay + ' ' + '&'
		print (command)
		process = subprocess.Popen(command, shell=True, stdout = subprocess.PIPE, stderr=subprocess.PIPE)
		(stdout, stderr) = process.communicate()
		
		if self.RmxType == 'RMX4000':
			# we'll need two sipp machines started the 1st instance anyway
			command = './scripts/runSipp ' + self.Sipp2Ip + ' ' + self.Sipp2Usr + ' ' + self.Sipp2Pass  + ' ' + self.DmaIp + ' ' + self.durationH + ' ' + self.durationM + ' ' + self.durationS + ' ' + self.rate + ' ' + self.holdTime + ' ' + self.name + ' ' + self.testType + ' ' + self.FR + ' ' + ' ' + self.monitor_delay + ' ' +'&'
			print (command)
			process = subprocess.Popen(command, shell=True, stdout = subprocess.PIPE, stderr=subprocess.PIPE)
			(stdout, stderr) = process.communicate()
		return

def main(myargs):
	testFile = myargs['-f']
	print ('INFO: test file is : ' + testFile)
	if not helper.isavailable(helper.getTestXml(testFile)): # validate if the file provided as input exists
		raise ValueError ('ERROR: Provided File in Arguments doesnt exist')
		sys.exit(0)

	file = './Tests/running/' + testFile.split('/')[3]
	os.rename(testFile, file)	# This would move the file from ROOTDIR/Tests/scheduled/ to ROOTDIR/Tests/running/
	testFile = file

	testFile = helper.getTestXml(testFile)
	t1 = test(helper.getXmlElem(testFile)) #	t1 now has all the user details
	
	attrs = vars(t1) 
	# now dump this in some way or another
	print ('Class is like below: \n',', '.join("%s: %s" % item for item in attrs.items()))
	
	'''
	stage 1: validate RMX IP, validate RMX type and validate build
	'''
	if t1.RmxIp is '0.0.0.0' or  t1.RmxType is 'INVALID': #	check rmx build and rmx ip
		raise ValueError ('ERROR: Bad test case parameters, check: RmxIP and Type')
	else:
		print ("RMX ip not null: " + t1.RmxIp)
		print ("rmx Type not invalid: " + t1.RmxType)

	if t1.RmxBuild == 'DEFAULT':
		print ("Rmx Build default: Latest")
		pass
	elif not helper.buildavailable(t1.RmxBuild):
		raise ValueError ('ERROR: Bad test case parameters, check: target rmx build')

	print ('Upgrading RMX\n')
	if not t1.executeupgrade():	# now upgrade the RMX
		raise ValueError ('Error: issue with rmx upgrade')

	# we'll wait for 20 mins after this
	print ('Wait for 20 mins and hold on for the RMX to upgrade')
	time.sleep(.10)

	# now run sipp
	print ('\n Running Sipp')
	t1.runSipp()
	return

if __name__ == '__main__':
	sys.dont_write_bytecode = True
	import helper
	myargs = helper.getopts(argv)
	if '-f' not in myargs:
		helper.printusage()
		raise ValueError ('ERROR: Incorrect usage')
	main(myargs)
	sys.exit(0)
