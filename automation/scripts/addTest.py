#!/usr/bin/python -tt

"""
created on 17th March 2018
@author: Abhishek Chattopadhyay
FName: addTest
"""

from __future__ import print_function
import os
import sys
import subprocess

template	=	'xml/templates/testtemplate.xml'
optionDir	=	'xml/options/'

def main(elements):
	print ('Add A TestCase to Execute')
	print (elements)
	print ('provide test case inputs, hit enter to skip')
	testCaseName	=	raw_input("Name your test case:(HINT: Must be unique add yyyy-mm-dd at the end): ")
	scheduleTime	=	raw_input("Schedule Time to execute:(HINT: HH:MM in 24 hrs format): ")
	scheduleDate	=	raw_input("Schedule Date:(HINT: DD-MM-YYYY): ")
	schedulePolicy	=	raw_input("Schedule Policy:(HINT: write [immediate] if you want schedule the test in next polling interval, usually next 5 mins): ")
	recurrence		=	raw_input("Recurrence:(HINT: [yes/no]): ")
	duration		=	raw_input("Duration:(HINT: in hours): ")
	RmxIp			=	raw_input("")
	
	
	
if __name__ == '__main__':
	sys.dont_write_bytecode = True
	import helper
	print ('parsing :' + template)
	main(helper.getXmlElem(template))
	sys.exit(0)
	
