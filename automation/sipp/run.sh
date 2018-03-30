#!/bin/bash -x
#usage ./run.sh <sipp-ip> <dma-ip> <time <hr> <min> <sec>> <rate> <holdTime> <tcName> <audioOnly=1 or audioVideo=2> <delay>
echo "`date`-> run.sh Starts, got inputs: ${1} ${2} ${3} ${4} ${5} ${6} ${7} ${8} ${9} ${10} ${11}" &>> /tmp/SIPP/run.log

# assign the input arguments
sippIP=${1}
dmaSutIP=${2} 
runTimeHr=${3}
runTimeMin=${4} 
runTimeSec=${5}
rate=${6}
holdTimeMil=${7}
tcName=${8}
opt=${9}
delay=${10}
fr=${11}

# Other variables used in the script
ratePeriodMil=1000000 
injectionFile="20partconfaudio.inf" 
workDir=/tmp/SIPP/
testDir=/tmp/Test/
completed=${testDir}completed/
scenarioDir=${testDir}running/
#now=`date +%d-%m-%Y-%H`
now=`date +%a_%d_%h_%Y_%H_%M`
sleep 30
#statFile=sipp-statistics_${now}.csv
statFile=${workDir}$tcName-stat.csv
tempStatFile=${workDir}temp-stat.log
report=${workDir}failureCheck.log
scenarioTempDir=${workDir}${tcName}_${now}
callDebugFile=${workDir}$tcName-${now}-calldebug.log
runlog=${workDir}run.log
scenarioXml=${scenarioDir}${tcName}.xml

# call failure check statistics variabled
pass=0
total=0
success=0
failed=0
failureRate=0

# function runs only once, creates the environmental changes like
# creating direcotries and files in appropriate locations
function setup () {
	touch $statFile
	echo "`date`-> created file: $statFile" &>> $runlog
	touch $callDebugFile
	echo "`date`-> created file: $callDebugFile" &>> $runlog
	if [ $opt -eq 1 ]
	then
		scenario='scen-reguac-audioonly.xml'
	else
		scenario='scen-uac.xml'
	fi
	mkdir -p ${scenarioTempDir}
	echo "`date`-> created Dir: ${scenarioTempDir}" &>> ${runlog}
}

# this function has only one purpose. 
# depending on the inputs from command line, run SIPP
function runSIPP () {
	runTime="`echo "${runTimeHr} * 3600  + ${runTimeMin} * 60 + ${runTimeSec}" | bc`s"
	echo "`date`-> sippIp: ${sippIP}, dmaIP: ${dmaSutIP}, rate: ${rate}, holdTime: ${holdTimeMil}, runTime: ${runTime}, tcname: ${tcName}, aud/vid: ${opt}, monitoring delay: ${delay}, Failure Rate: ${fr}" &>> ${runlog}

	echo "Command to execute is: \n /usr/local/bin/sipp -i ${sippIP} -p 5060 ${dmaSutIP} -sf ${scenario} -inf ${injectionFile} -t u1 -max_socket 15000 -r ${rate} -rp ${ratePeriodMil} -d ${holdTimeMil} -timeout ${runTime} -aa -stf ${statFile} -fd 5 -base_cseq 1 -skip_rlimit -pause_msg_ign  -trace_err -trace_screen -trace_shortmsg -trace_stat -trace_rtt -trace_msg -trace_calldebug -calldebug_file $callDebugFile" &>> $runlog

	/usr/local/bin/sipp						\
		-i ${sippIP}						\
		-p 5060 ${dmaSutIP}					\
		-sf		${scenario}					\
		-inf	${injectionFile}			\
		-t		u1							\
		-max_socket 15000					\
		-r 		${rate} 					\
		-rp 	${ratePeriodMil}			\
		-d 		${holdTimeMil}				\
		-timeout ${runTime}					\
		-aa									\
		-stf	${statFile}  				\
		-fd		5							\
		-base_cseq	1						\
		-skip_rlimit						\
		-pause_msg_ign	 					\
		-bg									\
		-trace_err 							\
		-trace_screen						\
		-trace_shortmsg 					\
		-trace_stat 						\
		-trace_rtt 							\
		-trace_msg							\
		-trace_calldebug					\
		-calldebug_file	$callDebugFile
}

#echo "`date`-> executing nohup ./failureRate.sh ${tcName} ${FR} 5 > $runlog " &>> $runlog

# this is the exit function
# perform cleanup of temporary files, and moves the generated log files to completed directory
function terminateTC () {
	echo "Date: `date` Pass: ${pass}, Total: ${total}, Success: ${success}, Failed: ${failed}, FailRate: ${failureRate}, Threshold: ${fr}" >> ${runlog}
	killall -9 sipp
	echo "`date`-> Failure rate maxed. Terminating case" >> ${runlog}
	# now lets move various files to completed state of the test case

	rm ${tempStatFile}
	# Since we are operating on a mounted file system there would be permission issues
	# so prefer to use cp and rm combination rather than mv
	cp --no-preserve=mode,ownership *.log ${scenarioTempDir}
	rm -f *.log # remove the files from /tmp/SIPP to /tmp/SIPP/scenario-name
	cp --no-preserve=mode,ownership *.csv ${scenarioTempDir}
	rm -f *.csv # remove the files from /tmp/SIPP to /tmp/SIPP/scenario-name
	cp -R ${scenarioTempDir} ${completed}
	rm -rf ${scenarioTempDir} # remove the scenario dir to /tmp/Test/Completed
	mv ${scenarioXml} ${completed} # move the xml test case from running to completed
	# move the test case from running to completed
	exit 0
}

# Function check the failure rate after the sipp is running
# has a 3 min interval between each check 
function failCheck () {
	echo "`date`-> Checking if the stat file: ${statFile} is available" &>> ${runlog}
	if [ ! -f ${fileToCheck} ]; then
		echo "`date`-> Can't find ${fileToCheck}" &>> ${runlog}
		terminateTC # terminate the test	
	fi

	echo "`date`-> Check if sipp is running or not" &>> ${runlog}
	sippPid=`ps -ef | grep sipp | grep -v grep | awk -F ' ' '{print $2}'`	
	if [ "$sippPid" > "0" ]; then
		echo "`date`-> SippPid: ${sippPid}" &>> ${runlog}
	else
		echo "`date`-> SippPid: ${sippPid}" &>> ${runlog}
		terminateTC # terminate the test		
	fi

	while [ 1 ]; do
		pass=$((pass+1)) # get the pass (iteration)
		# poll the last line from sipp stat file
		tail -1 ${statFile} >${tempStatFile}
		# calculate the total number of calls
		total=`cat ${tempStatFile} | cut -d';' -f13`
		# calculate the total failed
		failed=`cat ${tempStatFile} | cut -d';' -f18`
		# calculate the total passed
		success=`cat ${tempStatFile} | cut -d';' -f16`
		# if failed & total is greater than zero then calculate failure rate
		if [[ ( "${failed}" > "0" ) && ( "${pass}" > 0 ) ]]; then
			failureRate=$((100*${failed}/${total}))
			echo "`date`-> Iteration: ${pass},  Total: ${total}, Success: ${success}, Failed: ${failed}, FailureRate: ${failureRate}, Failure Threshold: ${fr}" &>> ${runlog}
			if [[ "${failureRate}" > "${fr}" ]]; then
				terminateTC # terminate the test
			fi
		else
			failureRate=0
		fi
		# check back in 120 minutes
		echo "`date`-> FailureCheck sleeping for 120 seconds now" &>> ${runlog}
		sleep 120
	done
}			
	
# This function Drives the test case
function main () {
	setup # setup the environment
	runSIPP # execute the SIPP as per the inputs received
	
	echo "`date`-> sleeping for ${delay} seconds" &>> ${runlog}
	#sleep ${delay}
	sleep 60
	
	failCheck # check Failure regularly	
	
}


# start main
main

#nohup ./failureRate.sh ${tcName} ${FR} 5 &>> $runlog &
