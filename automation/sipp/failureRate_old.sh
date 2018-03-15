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
thareshold=1
fr=$((100*$failed/$toatl))
echo "failure rate: $fr"
if [[ "$fr"> "$thareshold" ]]
then
kill -9  7109
echo "i am fine"
exit
fi
echo $fr
sleep 1 
done
exit
