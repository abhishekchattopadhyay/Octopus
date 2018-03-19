# usage ./failureRate.sh <scenarioName> <failureRate> <delay>
sleep $3
fileToCheck=${1}.csv
pass=0
while [ 1 ]
do
		pass=$((pass+1))
		echo "this-pass: $pass"
		tail -1 $1 >tmp.txt
		toatl=`cat tmp.txt | cut -d';' -f13`
		echo "toatl: $toatl"
		failed=`cat tmp.txt | cut -d';' -f18`
		echo "failed: $failed"
		success=`cat tmp.txt | cut -d';' -f16`
		echo "success: $success"
		d=date
		echo "this-pass: $pass date: `date`  failed: $failed success: $success total: $total"
		thareshold=$2
		fr=$((100*$failed/$toatl))
		echo "failure rate: $fr"
		if [[ "$fr"> "$thareshold" ]]
		then
			killall -9 sipp
			echo "i am fine"
			echo "failure rate maxed out at :"
			date
			exit
		fi
		echo $fr
		sleep 120
done
exit
