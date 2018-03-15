#!/usr/bin/python -tt

'''
created on March 7, 2018
@author: achattopadhyay
'''
from __future__ import print_function
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
		self.name			= 	elements['name']
		self.duration		= 	elements['duration']
		self.recurrence		=	elements['recurrence']	
		self.time			= 	elements['time']
		self.date			= 	elements['date']
		self.RmxIp			= 	elements['RmxIp']
		self.RmxType		=	elements['RmxType']
		self.RmxBuild		= 	elements['RmxBuild']
		self.RmxUser		=	elements['RmxUser']
		self.RmxPass		=	elements['RmxPass']
		self.RmxSuPass		=	elements['RmxSuPass']
		self.DmaIp			=	elements['DmaIp']
		self.SippIp1		=	elements['SippIp1']
		self.SippIp2		=	elements['SippIp2']
		self.testType		=	elements['testType']
		self.videoType		=	elements['videoType']
		self.protocol		=	elements['protocol']
		self.protocol		=	elements['FR']
		self.onFailRestart	=	elements['onFailRestart']
		self.emailTo		=	elements['emailTo']

	def executeupgrade(self):
			command = './scripts/upgradeRMX ' +  self.RmxIp + ' ' + self.RmxUser + ' ' + self.RmxPass 
			print (command)
			process = subprocess.Popen(command, shell = True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			(stdout, stderr) = process.communicate()
			print (stderr)
			if process.returncode != 0:
				return False
			return True	

	def runSipp(self):
		return

def main(myargs):
	testFile = myargs['-f']
	print ('test file is : ' + testFile)
	if not helper.isavailable(helper.getTestXml(testFile)): # validate if the file provided as input exists
		raise ValueError ('ERROR: Provided File in Arguments doesnt exist')

	file = './Tests/running/' + testFile.split('/')[3]
	os.rename(testFile, file)
	testFile = file

	testFile = helper.getTestXml(testFile)
	t1 = test(helper.getXmlElem(testFile)) #	t1 now has all the user details
	
	'''
	stage 1:
		validate RMX IP
		validate RMX type
		validate build
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

	# now upgrade the RMX
	if not t1.executeupgrade():
		raise ValueError ('Error: issue with rmx upgrade')

	# we'll wait for 20 mins after this
	time.sleep(20)

	# now run sipp
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
