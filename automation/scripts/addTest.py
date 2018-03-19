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
import datetime
import xml.etree.ElementTree as ET

BASEDIR		=	'.'
_template	=	BASEDIR +	'/xml/templates/testtemplate.xml'
optDir		=	BASEDIR +	'/xml/options/'
testDir		=	BASEDIR	+	'/Tests/tbd/'
runningDir	=	BASEDIR	+	'/Tests/running/'
completedDir=	BASEDIR	+	'/Tests/completed/'
scheduledDir=	BASEDIR	+	'/Tests/scheduled/'
debug		=	False

def Print(level,statement):
	global debug
	if debug:
		print (level+':',statement)

def inputMsg(msg1, msg2):
	return '['+msg1+'] '+msg2

def getInp(item,tag, msg):
	inp = raw_input(inputMsg(item[tag],msg))
	if inp != '':
		item[tag] = inp
	else:
		Print('INFO: ', 'using old value:')
		
class userTest:
		def __init__(self,elements):
			self.tcEdit = False
			self.foundPath = ''
			self.user =	elements
			self.getInput()
			return
		
		def getInput(self):	#function gets inputs from the user and returns a dict of inputs	
				print ('INFO','provide test case inputs, hit enter to auto-generate')
				now = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
				self.user['id'] = now
				
				msg = 'Name your test case:(HINT: Must be unique add yyyy-mm-dd at the end): '	
				inp	=	raw_input(msg)
				if inp != '':
					if self.validateName(inp):
						self.tcEdit = True
						self.user = helper.getXmlElem(self.foundPath+inp+'.xml')
					else:
						self.user['id'] = inp
				else:
					self.user['id']	= now
					print ('INFO: AUTOGENERATED: Test Name: ', str(now)+'.xml')
					
				getInp (self.user,'SCHEDULE_TIME','Schedule Time: [enter 0 to immediately schedule]')
				getInp (self.user,'SCHEDULE_DATE','Schedule Date:(HINT: DD-MM-YYYY): ')
				getInp (self.user,'SCHEDULE_POLICY','Schedule Policy: ')
				
				if int(self.user['SCHEDULE_TIME']) == 0:
					self.user['SCHEDULE_POLICY']	= 'immediate'
					print ('INFO: Test case schedule is: ',self.user['SCHEDULE_POLICY'])

				getInp (self.user, 'RECURRENCE','Recurrence:(HINT: [yes/no]): ')
				getInp (self.user, 'DURATION_H','Duration:(HINT: in hours): ')

				self.user['DURATION_M']		=	0 # not allowed now
				self.user['DURATION_S']		=	0 # not allowed now

				getInp (self.user,'RMX_IP',"RMX IP: ")
				getInp (self.user,'RMX_TYPE',"Rmx Type: ")
				getInp (self.user,'RMX_BUILD', 'Rmx Build: (ex: RMX_8.7.5.499): ')
				getInp (self.user,'RMX_USER','Rmx ssh user name: ')
				getInp (self.user,'RMX_PASS','Rmx ssh password: ')
				getInp (self.user,'RMX_SU_PASS','Rmx super user password:')
				getInp (self.user,'DMA_IP', "DMA IP: ")
				getInp (self.user,'SIPP_PRIMARY',"primary Sipp IP: ")
				getInp (self.user,'SIPP_PRI_USR',"primary Sipp ssh user: ")
				getInp (self.user,'SIPP_PRI_PASS',"primary Sipp ssh password: ")
				getInp (self.user,'SIPP_SECONDARY',"secondary Sipp IP: ")
				getInp (self.user,'SIPP_SEC_USR',"secondary Sipp ssh user: ")
				getInp (self.user,'SIPP_SEC_PASS',"secondary Sipp ssh passowrd: ")
				getInp (self.user,'TEST_TYPE',"Test Type: ")
				getInp (self.user,'VIDEO_TYPE',"Video Type: ")
				getInp (self.user,'PROTOCOL',"Protocol: ")
				getInp (self.user,'RATE',"Rate:(HINT: This the same rate calculation you did in sipp scripts): ")
				getInp (self.user,'HOLDTIME',"Hold Time: ")
				getInp (self.user,'MONITOR_DELAY',"Monitor delay:(HINT: This is the time in minute the failure rate checked would wait feore starting to monitor your sipp load stats): ")
				getInp (self.user,'FR',"Failure Rate:(HINT:% failure to monitor): ")
				getInp (self.user,'ON_FAIL_RESTART','yes/ no: ') 		# not allowed now
				getInp (self.user,'EMAILTO','email: ')	# not allowed now
				Print ('INFO',self.user)
				#return self.user

		def validateName(self,name):
		#	Check name of test case for uniqueness
			paths = [testDir, scheduledDir, completedDir]
			for path in paths:
				if name+'.xml' in os.listdir(path):
					self.foundPath =  path
					print('INFO: ', 'You are editing an existing tc')
					return True

			if name in os.listdir(runningDir):
				raise ValueError('ERROR: This test case is running, cant edit')
			return False

		def validate(self):	#	function validates all the inputs by user
			result	=	True
			print ('Let me quickly check the inputs')
			print ('INFO: ','Checking build')
			if self.user['RMX_BUILD'] == 'default' or helper.buildavailable(self.user['RMX_BUILD']):
				print ('Build choice is fine')
			else:
				result = result & False
				
			print ('INFO: Checking if I can reach RMX IP')
			output = subprocess.Popen(['ping', '-c','4',self.user['RMX_IP']],stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()[0]
			if "Destination host unreachable" in output.decode('utf-8'):
				print ("{} is offline".format(self.user['RMX_IP']))
				result = result & False
			else:
				print ('RMX Rechable')
				
			print ('INFO: Checking if I can reach the SIPP machine: ',self.user['SIPP_PRIMARY'] )
			output = subprocess.Popen(['ping', '-c','4',self.user['SIPP_PRIMARY']],stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()[0]
			if "Destination host unreachable" in output.decode('utf-8'):
				print ("{} is offline".format(self.user['SIPP_PRIMARY']))
				result = result & False
			else:
				print  ('SIPP Rechable')

			if self.user['RMX_TYPE'] == 'RMX4000':
				print ('INFO: Checking is I can reach the 2nd SIPP machine:', self.user['SIPP_SECONDARY'])
				output = subprocess.Popen(['ping', '-c','4',self.user['SIPP_SECONDARY']],stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()[0]
				if "Destination host unreachable" in output.decode('utf-8'):
					print ("{} is offline".format(self.user['SIPP_SECONDARY']))
					result = result & False
				else:
					print ('SIPP Rechable')

			if result == True:
				print ('All Good adding test case now')
			else:
				print ('one or more errors')
			return result
				
		def addTest(self):	#	function adds the test case to the be scheduled
			testFile = testDir + self.user['id'] + '.xml'
			root	=	ET.Element('TEST')
			for key in self.user.keys():			#	Create the test XML
				if key == 'id':					#	id tag it's a root element
					root.attrib[key]	=	self.user['id']
				ET.SubElement(root, key).text	=	self.user[key]
	
			tree	=	ET.ElementTree(root)	
			
			if 	self.tcEdit:
				fileToRemove = self.foundPath + self.user['id'] + '.xml'
				os.remove(fileToRemove)
				print ('INFO: ','Removed file: ', fileToRemove)
			
			tree.write(testFile)	# write the pirmary test xml
			print ('INFO: ', 'New test case added, filename: ', testFile)
		
		def addToXmlDB():
			pass
			
			
			
def main(elements):
	print ('Add A TestCase to Execute')
	Print ('INFO',elements)
	test = userTest(elements)
	if test.validate() == True:
		test.addTest()
			
if __name__ == '__main__':
	sys.dont_write_bytecode = True
	import helper
	main(helper.getXmlElem(_template))
	sys.exit(0)
	
