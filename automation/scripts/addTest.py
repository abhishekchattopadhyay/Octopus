#!/usr/bin/python -tt

""""
created on 17th March 2018
@author: Abhishek Chattopadhyay
FName: addTest
"""

from __future__ import print_function
import os
import sys
import subprocess
import xml.etree.ElementTree as ET

BASEDIR		=	'./'
_template	=	BASEDIR +	'/xml/templates/testtemplate.xml'
optDir		=	BASEDIR +	'/xml/options/'
testDir		=	BASEDIR	+	'/Tests/tbd/'
runningDir	=	BASEDIR	+	'/Tests/running/'
completedDir=	BASEDIR	+	'/Tests/
debug		=	False

def Print(level,statement):
	global debug
	if debug:
		print (level+':',statement)
		
class userTest:
		def __init__(self):
			self.user	=	getInput()
			return
		
		def getInput():	#function gets inputs from the user and returns a dict of inputs	
				print ('provide test case inputs, hit enter to skip')
				self.user['id']				=	raw_input("Name your test case:(HINT: Must be unique add yyyy-mm-dd at the end): ")
				self.user['SCHEDULE_TIME']	=	raw_input("Schedule Time to execute:(HINT: HH:MM in 24 hrs format): ")
				self.user['SCHEDULE_DATE']	=	raw_input("Schedule Date:(HINT: DD-MM-YYYY): ")
				self.user['SCHEDULE_POLICY']=	raw_input("Schedule Policy:(HINT: write [immediate] if you want schedule the test in next polling interval, usually next 5 mins): ")
				self.user['RECURRENCE']		=	raw_input("Recurrence:(HINT: [yes/no]): ")
				self.user['DURATION_H']		=	raw_input("Duration:(HINT: in hours): ")
				self.user['DURATION_H']		=	0 # not allowed now
				self.user['DURATION_H']		=	0 # not allowed now
				self.user['RMX_IP']			=	raw_input("RMX IP: ")
				self.user['RMX_TYPE']		=	raw_input("Rmx Type: ")
				self.user['RMX_BUILD']		=	raw_input("Rmx Build:(HINT: press enter for latest, else it should look like RMX_8.7.5.987")
				self.user['RMX_USER']		=	raw_input("Rmx ssh user name:(HINT: press enter to use default): ")
				self.user['RMX_PASS']		=	raw_input("Rmx ssh password:(HINT: press enter to use default): ")
				self.user['RMX_SU_PASS']	=	raw_input("Rmx super user password:(HINT: press enter to use default): ")
				self.user['DMA_IP']			=	raw_input("DMA IP: ")
				self.user['SIPP_PRIMARY']	=	raw_input("primary Sipp IP: ")
				self.user['SIPP_PRI_USR']	=	raw_input("primary Sipp ssh user: ")
				self.user['SIPP_PRI_PASS']	=	raw_input("primary Sipp ssh password: ")
				self.user['SIPP_SECONDARY']	=	raw_input("secondary Sipp IP: ")
				self.user['SIPP_SEC_USR']	=	raw_input("secondary Sipp ssh user: ")
				self.user['SIPP_SEC_PASS']	=	raw_input("secondary Sipp ssh passowrd: ")
				self.user['TEST_TYPE']		=	raw_input("Test Type: ")
				self.user['VIDEO_TYPE']		=	raw_input("Video Type: ")
				self.user['PROTOCOL']		=	raw_input("Protocol: ")
				self.user['RATE']			=	raw_input("Rate:(HINT: This the same rate calculation you did in sipp scripts): ")
				self.user['HOLDTIME']		=	raw_input("Hold Time: ")
				self.user['MONITOR_DELAY']	=	raw_input("Monitor delay:(HINT: This is the time in minute the failure rate checked would wait feore starting to monitor your sipp load stats): ")
				self.user['FR']				=	raw_input("Failure Rate:(HINT:% failure to monitor): ")
				self.user['OnFailRestart']	=	'NO' 		# not allowed now
				self.user['EMAILTO']		=	'INVALID'	# not allowed now
				Print (self.user)
				return self.user

		def validateName():
		#	Check name of test case for uniqueness
			print ('Validating name')
			allCases	=	os.listdir(testDir) + os.listdir(scheduledDir) + os.listdir(runningDir) + os.listdir(completedDir)	
			if self.user['id'] in allCases:
				print ('This test name is taken: ')
				return False
			else:
				print ('This test name is fine')
				return True
		
		def validateRmx():
		#	Cheks the resources of RMX
			print ('validating rmx details')
			rmxXml	=	BASEDIR + '/xml/xmlDB/rmx.xml'
			tree	=	ET.parse(rmxXml)
			root	=	tree.getroot()
			if self.user['RmxIp'] not in root.findall('RMX'):
				ET.SubElement(root,'RMX').text	=	self.user['RmxIp']
			else:
				pass

		def validate():	#	function validates all the inputs by user
			while not validateName():
				self.user['id']	=	raw_input("Name your test case:(HINT: Must be unique add yyyy-mm-dd at the end): ")
	
				while not validRmx(input):
		
		def addTest(input, testFile):	#	function adds the test case to the be scheduled
			root	=	ET.Element('TEST')
			#ET.Element(root, id=input['id'])	#	insert the id tag name
			for key in input.keys():			#	Create the test XML
				if key == 'id':					#	id tag it's a root element
					root.attrib[key]	=	input['id']
				ET.SubElement(root, key).text	=	input[key]
	
			tree	=	ET.ElementTree(root)	
			tree.write(testFile)	# write the pirmary test xml
			addToXmlDB()			# make necessary arrangement in the xml DB
		
		def addToXmlDB():
			
			
			
def main(elements):
	print ('Add A TestCase to Execute')
	Print (elements)
	test = userTest()
	while not test.validate():
		continue
	testFile=	testDir + input['id'] + '.xml'
	addTest(input,testFile)
			
if __name__ == '__main__':
	sys.dont_write_bytecode = True
	import helper
	print ('parsing :' + template)
	main(helper.getXmlElem(template))
	sys.exit(0)
	
