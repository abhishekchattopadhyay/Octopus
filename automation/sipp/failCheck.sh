#!/bin/bash
#########################################################################################
# created on 21st March 2018
# @author: Abhishek chattopadhyay
# Purpose: runs the sipp fail checker silently
# format:  nohup ./modified_failure_rate.sh 2018-03-21-04-52-55 5 1 > 2018-03-21-04-52-55
#########################################################################################
sleep 5
nohup ./modified_failure_rate.sh $1 $2 $3 > $1 &
exit 0

