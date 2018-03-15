#!/bin/bash
#usage ./run.sh <sipp-ip> <dma-ip> <time <hr> <min> <sec>> <rate> <holdTime> <tcName> <audioOnly=1 or audioVideo=2>

sippIP=$1 #'10.206.151.26' #arg1 -si
dmaSutIP=$2 #'10.206.151.56' #arg2 -di
runTimeHr=$3 #72 #arg3 -h
runTimeMin=$4 #0 #arg4 -m
runTimeSec=$5 #0 #arg5 -s
rate=$6 #5000 #arg6 -r
holdTimeMil=$7 #70000 #arg7 -h
ratePeriodMil=1000000 #arg8 -rp
injectionFile="20partconfaudio.inf" #arg9 -inf
tcName=$8
now=`date +%F_%M-%S`
#statFile=sipp-statistics_${now}.csv
statFile=${tcName}.csv
runTime="`echo "${runTimeHr} * 3600  + ${runTimeMin} * 60 + ${runTimeSec}" | bc`s"
opt=$9
if [ $opt -eq 1 ]
then
	scenario='scen-uac.xml'
else
	scenario='scen-reguac-audioonly.xml'
fi

/usr/local/bin/sipp						\
	-i $1 -p 5060 $2					\
	-sf    ${scenario}					\
	-inf   ${injectionFile}				\
	-t u1  -max_socket 15000			\
	-r ${rate} -rp ${ratePeriodMil}		\
	-d ${holdTimeMil}					\
	-timeout ${runTime}					\
	-aa									\
	-stf   ${statFile}  -fd 5			\
	-trace_err -trace_screen -trace_shortmsg -trace_stat -trace_rtt -trace_msg 


