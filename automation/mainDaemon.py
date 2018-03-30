#!/usr/bin/python -tt

'''
created on March 9, 2018
@author: achattopadhyay
this script run infinitely and schedules the jobs
'''

from __future__ import print_function
import os
import sys
import time
import threading
import datetime
import subprocess
import xml.etree.ElementTree as ET
#from test.test_decimal import directory

runningTests = []	# this list to hold the running tests

rootDir = './'	# while in production this would change

class test_thread(threading.Thread):
	'''
	This class executes the test that is described in the 
	xml file
	'''

	def __init__(self, threadID, name, counter, tc):
		threading.Thread.__init__(self)
		self.test = tc
		self.threadID = threadID
		self.name = name
		self.counter = counter

	def run(self):
		''' 
		the main thread simply executes the main runner of tests 
		and feeds the test.xml to the test case
		all the intrecasies are handled in runTest.py
		'''
		print ('working with : ' + self.test)
		command = './scripts/runTest.py -f ' + './Tests/scheduled/' + self.test
		print ('executing command: ' + command)
		process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
		(stdout,stderr) = process.communicate()	# trigger the runner with a valid argument
		print ('DONE\n\n\n')
		return
	
def getrootdir():	# in production version this should get the root dir for all subsequent scripts
	pass

'''
Get all the test cases which are added to the test suite
validate which tests to schedule
run the tests on the input files
'''
def getscheduledtests():
	scheduled=[]
	directory = rootDir + 'Tests/tbd/'
	tests = os.listdir(directory) 			# get all tests
	#tests = [dir+a for a in tests]
	print ('INFO: Checking test case files\n',',\n'.join(tests))
	
	# get scheduled for this hour 
	now = datetime.datetime.now()
	date = now.strftime("%d-%m-%Y")
	time = now.strftime("%H")
	print ('INFO: Current time ', end='')
	print (date, time)
	
	# get the schedule time for all the files and check which ones to run
	for tc in tests:
		tc = directory + tc
		print ('checking configured schedule in: ' + tc)
		tree = ET.parse(tc)
		root = tree.getroot()
		dt = root.find('SCHEDULE_DATE').text
		ti = (root.find('SCHEDULE_TIME').text).split(':')[0]
		print ('Scheduled date and time in file is |'+dt+'|', ti + '|  ', end='')
		policy = root.find('SCHEDULE_POLICY').text
		print (policy)
		if (date == dt or date == 'TODAY') and ti == time:
			print ('This scenario will be added: YES')
			scheduled.append(tc)
		elif root.find('SCHEDULE_POLICY').text == 'IMMEDIATE':
			print ('This scenario would get scheduled immediately')
			scheduled.append(tc)
		else:
			print ('This scenario will be added: NO')
	print ('All scheduled cases : ', end='')
	print (scheduled)
	return scheduled

'''
Function moves the scheduled files
from ROOTDIR/Tests/tbd to ROOTDIR/tests/scheduled
'''
def moveFilesToScheduled(tests):
	for item in tests:
		os.rename(item, './Tests/scheduled/'+item.split('/')[3])

def action(): 
	'''
	start a thread for each test and 
	trigger necessary actions in that thread
	'''
	directory = './Tests/scheduled/'
	tests = os.listdir(directory) 		# get all tests
	for item in tests:
		t = test_thread(0,0,0,item)	# get a worker thread for each test to be executed
		runningTests.append(t)		# append the thread in running queue
		t.start()					# start the thread: here the threads 
									# somewhere we'll need to join this thread in main thread
		
def main():
	'''
	in an infinite loop 
	check for all the tasks added
	find the once which match the test of schedule or needs immediate scheduling
	for all the actionable tests run the test case
	'''
	# start a thread which moves test cases from running to completed
	
	while(1):
		tests = getscheduledtests()	# check for scheduled jobs
		print ('INFO: Checking for targets in /Tests/tbd/')
		if len(tests) > 0:
			moveFilesToScheduled(tests)
			action()					# for now just run this
		else:
			print ('INFO: No tests to schedule')

		#sys.exit(0)					#   in production ths line should be taken down
		time.sleep(60)				#	run the loop after 1 min looking for more scheduled jobs
	return

if __name__ == '__main__':
	sys.dont_write_bytecode = True
	getrootdir()
	main()
	sys.exit(0)
