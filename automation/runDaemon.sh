#!/bin/bash
# Created on: 	20th March 2018
# @Author:		Abhishek Chattopadhyay
# objective: 	to keep the mainDaemon running at all times


while  [ 1 ]
do
	killall -9 mainDaemon.py
	./mainDaemon.py
	sleep 10
done
