#!/bin/bash
######################################################################################################################
# created: 21st march 2018
# @author: Abhishek Chattopadhyay
# Purpose: it runns the sipp running script run.sh silently so that the expect script runns seamlessly
# format :./run.sh <sipp-ip> <dma-ip> <time <hr> <min> <sec>> <rate> <holdTime> <tcName> <audioOnly=1 or audioVideo=2>
######################################################################################################################
sleep 5
nohup ./run.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 &
exit 0

