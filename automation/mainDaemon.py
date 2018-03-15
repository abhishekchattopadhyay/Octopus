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
from sys import argv
import xml.etree.ElementTree as ET
runningTests = []

rootDir = './'

class test_thread(threading.Thread):
	def __init__(self, threadID, name, counter, tc):
		threading.Thread.__init__(self)
		self.test = tc
		self.threadID = threadID
		self.name = name
		self.counter = counter

	def run(self):
		print ('working with : ' + self.test)
		# trigger the runner with a valid argument
		command = './scripts/runTest.py -f ' + './Tests/scheduled/' + self.test
		print ('executing command: ' + command)
		process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
		(stdout,stderr) = process.communicate()
		return
	
def getrootdir():
	pass

def getscheduledtests():
	scheduled=[]
	dir = rootDir + 'Tests/tbd/'
	tests = os.listdir(dir) # get all tests
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
		tc = dir + tc
		print ('checking configured schedule in: ' + tc)
		tree = ET.parse(tc)
		root = tree.getroot()
		dt = root.find('SCHEDULE_DATE').text
		ti = (root.find('SCHEDULE_TIME').text).split(':')[0]
		print ('Scheduled date and time in file is |'+dt+'|', ti + '|  ', end='')
		if date == dt and ti == time:
			print ('This scenario will be added: YES')
			scheduled.append(tc)
		else:
			print ('This scenario will be added: NO')

	print (scheduled)
	return (scheduled)
def moveFilesToScheduled(tests):
	print ('moveFilesToScheduled')
	for item in tests:
		os.rename(item, './Tests/scheduled/'+item.split('/')[3])

def action():
	dir = './Tests/scheduled/'
	tests = os.listdir(dir) # get all tests
	for item in tests:
		t = test_thread(0,0,0,item)
		runningTests.append(t)
		t.start()
		
			
def main():
	while(1):
		# check for scheduled jobs
		print ('INFO: Checking for targets in /Tests/tbd/')
		tests = getscheduledtests()
		if len(tests) > 0:
			print ('INFO: tests that needs scheduling: \n', ',\n'.join(tests))
			moveFilesToScheduled(tests)
			print ('Now take action on each of the tests')
		else:
			print ('INFO: No tests to schedule')
		action() # for now just run this
		time.sleep(60) #	run the loop after 1 min looking for more scheduled jobs
		sys.exit(0)
	return

if __name__ == '__main__':
	sys.dont_write_bytecode = True
	getrootdir()
	main()
	sys.exit(0)
