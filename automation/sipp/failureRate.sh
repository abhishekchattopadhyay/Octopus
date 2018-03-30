#!/bin/bash -x
# usage ./failureRate.sh <scenarioName> <failureRate> <delay>
sleep $3
scenarioname=$1
fileToCheck=/tmp/output/${scenarioname}.csv
pass=0
out=/tmp/output/temp-${scenarioname}.txt
report=/tmp/${scenarioname}-report.txt
while [ 1 ]
do
		pass=$((pass+1))	# get the pass (iteration)
		# poll the last line in the ouput of sipp
		tail -1 $fileToCheck >$out
		# calculate total number of calls
		total=`cat $out | cut -d';' -f13`
		# calculate total failed
		failed=`cat $out | cut -d';' -f18`
		# calculate total passed
		success=`cat $out | cut -d';' -f16`
		threshold=$2
		fr=$((100*$failed/$total))
		echo "Date: `date` Pass: $pass Total: $total Success: $success Failed: $failed FailRate: $fr Threshold: $threshold" >> $report
		if [[ "$fr"> "$threshold" ]]
		then
			killall -9 sipp
			echo "Date: `date` Failure rate maxed out at. Terminating case" >> $report
			# move the generated report to report folder to indicate completion
			mv $report /tmp/report
			exit
		fi
		#echo $fr
		sleep 120
done
exit
