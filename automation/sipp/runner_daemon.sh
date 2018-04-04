#!/bin/bash

#inputdir=/tmp/output/
inputdir=/tmp/Test/running/
runDir=/tmp/SIPP/
outdir=/tmp/Test/output/
# identify self IP
selfIP=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | grep -v '192*'`
# identify today's date
#dt=`date | awk -F ' ' '{print $2 $3 $4}'`
dt=`date +%d-%m-%Y`
now=`date +%H`
runlog=${outdir}${selfIP}-execution.log
touch $runlog

while [ 1 ]; do
	sippPid=`ps -ef | grep sipp | grep -v grep | awk -F ' ' '{print $2}'`
	echo "`date`-> Sipp running pid is : $sippPid" &>> $runlog
	if [ "$sippPid" > "0" ]; then # if sipp is running then no need to look beyond
		sleep 60
		continue
	else
		echo "`date`-> Apparently no sipp is running" &>> $runlog
		# identify all the files which needs to be parsed
		for file in $inputdir*.xml; do
			echo "`date`-> test file: $file	" &>> $runlog

			date=`cat $file| awk -F 'SCHEDULE_DATE>' '{print $2}' | awk -F '<' '{print $1}'`
			echo "`date`-> schedule date: $date" &>> $runlog

			ti=`cat $file | awk -F 'SCHEDULE_TIME>' '{print $2}' | awk -F '<' '{print $1}'`
			echo "`date`-> schedule time: $ti" &>> $runlog

			policy=`cat $file | awk -F 'SCHEDULE_POLICY>' '{print $2}' | awk -F '<' '{print $1}'`
			echo "`date`-> schedule policy: $policy" &>> $runlog

			sipp1=`cat $file | awk -F 'SIPP_PRIMARY>' '{print $2}' | awk -F '<' '{print $1}'`
			echo "`date`-> sipp primary ip: $sipp1" &>> $runlog

			sipp2=`cat $file | awk -F 'SIPP_SECONDARY>' '{print $2}' | awk -F '<' '{print $1}'`
			echo "`date`-> sipp secondary: $sipp2" &>> $runlog
			

			# check if we need to work on this file
			if [ "$selfIP" == "$sipp1" ] || [ "$selfIP" == "$sipp2" ]; then
				echo "`date`-> There are files to check" &>> $runlog
				
				tcname=`cat $file | awk -F 'TEST id="' '{print $2}' | awk -F '"' '{print $1}'`
				echo "`date`-> Test case name: $tcname" &>> $runlog
				
				needLoadTest=`cat $file | awk -F 'LOAD>' '{print $2}' | awk -F '<' '{print $1}'`
				if [[ ( "$needLoadTest" == "no" ) || ( "$needLoadTest" == "NO" ) ]]; then
					echo "`date`-> Load test is not required in this test case, continue" &>> $runlog
					continue
				fi

				# now check schedule
				echo "`date`-> checking Schedule" &>> $runlog
				if [[ ( "$dt" == "$date"  &&  "$now" == "$ti" ) || ( "$policy" == "IMMEDIATE" ) ]]; then
					echo "`date`-> xml test scheduling started" &>> $runlog

					loadDelay=`cat $file | awk -F 'LOAD_DELAY>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date` -> load delay would be: $loadDelay" &>> $runlog

					upgrade=`cat $file | awk -F 'UPGRADE>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Is Rmx Upgraded: $upgrade" &>> $runlog
					if [[ ( "$upgrade" == "no" ) || ( "$upgrade" == "NO" ) ]]; then
						loadDelay=0
						echo "`date`-> Load delay is nil now: will not wait before starting load" &>> $runlog
					else
						loadDelayInSec=$((loadDelay*60))
						echo "`date`-> Load Delay triggered: now sleeping for ${loadDelayInSec} seconds" &>> $runlog
						sleep $loadDelayInSec # must sleep as per the load Delay (This is time when RMX upgrades)
					fi

					dmaIP=`cat $file | awk -F 'DMA_IP>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> DMA IP: $dmaIP" &>> $runlog

					hour=`cat $file | awk -F 'DURATION_H>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Duration in hour: $hour" &>> $runlog

					minute=`cat $file | awk -F 'DURATION_M>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Duration in Min: $minute" &>> $runlog

					second=`cat $file | awk -F 'DURATION_S>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Dutation in sec: $second" &>> $runlog

					holdtime=`cat $file | awk -F 'HOLDTIME>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Hold time: $holdtime" &>> $runlog

					cps=`cat $file | awk -F 'CPS>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> CPS: $cps" &>> $runlog

					rate=`cat $file | awk -F 'RATE>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Call Rate: $rate" &>> $runlog

					fr=`cat $file | awk -F 'FR>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Failure rate: $fr" &>> $runlog

					monitorDelay=`cat $file | awk -F 'MONITOR_DELAY>' '{print $2}' | awk -F '<' '{print $1}'`
					echo "`date`-> Start monitoring after: $(($monitorDelay*60)) seconds" &>> $runlog

					if [ $cps -eq 5 ]; then
						opt=2
						echo "`date`-> This is going to be a audio only test" &>> $runlog
					else
						opt=1
						echo "`date`-> This is going to be a audio video test" &>> $runlog
					fi

					echo "`date`-> Hold on.. . " &>> $runlog
					sleep 5
				
					# run sipp
					cd $runDir
					echo "`date`-> At running helm.: $runDir" &>> $runlog
					
					echo "`date`-> Cleaning up last run artifacts if left any executing cleanup.sh" &>> $runlog
					./cleanup.sh
					
					echo "`date`-> Wait for $monitorDelay min before monitoring the load result" &>> $runlog
					actualDelay=$((monitorDelay*60))
					
					echo "`date`-> Starting sipp as per above settings" &>> $runlog
					echo "`date`-> Running: ./run.sh $selfIP $dmaIP $hour $minute $second $rate $holdtime $tcname $opt $actualDelay $fr" &>> $runlog
					
					./run.sh $selfIP $dmaIP $hour $minute $second $rate $holdtime $tcname $opt $actualDelay $fr
					echo "`date`-> run.sh quits SIPP continues to run in background mode" & >> $runlog
					echo "`date`-> Sipp started & monitoring started" &>> $runlog

					break # and don't come in till sipp is running 
				else # if not in schedule
					continue
				fi
			else # if not this sipp
				continue
			fi
		done # for each file in the list of inputs
	fi # if sipp is running or not
	sleep 60 # sleep for 1 mins before checking again
done
