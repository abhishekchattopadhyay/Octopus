#!/bin/bash
# #!/bin/bash -x

# ##########
# # determine if this script was sourced(called) as a part of a fully automated run (testrunner.sh)
# if [ "${ws}x" = "x" ] ;
# then
#     calledAsSimpleTool="1"
#    
#     # if not - it was called as a part of an automation assisted run (by a person, from the command line)
#     #          define some variables to identify the locations of some useful scripts 
#     cwd=$(cd `dirname $0`; pwd -P)
#     ws=$(cd ${cwd}/../../../../..; pwd -P)
#    
#     hls=${ws}/high-level-scripts
#     st=${ws}/simple-tools
#     commonFunctionDir=${hls}/complexUC/common
# else 
#     calledAsSimpleTool="0"
# fi
# jardir=${st}/dma-configuration
jardir=.
#
# ##########
# # source some scripts that contain utility functions
# . ${commonFunctionDir}/log.sh
#
#
# if [ ${calledAsSimpleTool} = "1" ]
# then
#     trace=${TRACE_ON}
#     logLevel=${LOGLEVEL_OFF}
#
#     #the following should be the first parm to each log invocation,
#     # for now just use this global value
#     myLogLevel=${LOGLEVEL_ALL}
# fi

########################################
# default parameter values
dma=''
configOption='all'
mcuList=''

function usage()
{
   echo "Usage:"
#   echo "configure.sh --dma <dma>  --config-option <config-option>  --mcu <mcu_dns_name> [--mcu <mcu_dns_name>]..."
   echo "configure.sh --gk_id <dma_dns_name>  --config-option <config-option>  --mcu <mcu_dns_name> [--mcu <mcu_dns_name>]..."
   echo ""
   echo " <config-option> ::= all            | rm-all"
   echo "                   | testconfig     | rm-testconfig"
   echo "                   | scenarioconfig | rm-scenarioconfig"
   echo ""
   exit 1
}

function parseParms()
{
    # trace "entr parseParms ($*)"
    echo "entr parseParms ($*)"
    
    TEMP=`getopt -o h -l help,gk_id:,config-option:,mcu: -n 'configure.sh' -- "$@"`
    if [ $? != 0 ] ; then echo "getopt is reporting a parameter problem (perhaps a bug in getopt options)" >&2 ; exit 1 ; fi

    eval set -- "$TEMP"

    while true; do
	case "$1" in
	    -h | --help)
		usage ; exit ;;

	    --config-option)
		# last named configOption wins
		configOption="$2"; shift 2 ;;
	           
#	    --dma)
	    --gk_id)
		dma="$2"; shift 2 ;;
	    
	    --mcu)
		mcuList="$mcuList $2"; shift 2 ;;

	    --)        shift; break ;;
            *)         break ;;
	esac
    done

    #debuging code
    # log "gk_id=>${dma}<"
    # log "configOption=>${configOption}<"
    # log "mcuList=>${mcuList}<"
    echo "gk_id=>${dma}<"
    echo "configOption=>${configOption}<"
    echo "mcuList=>${mcuList}<"

    # ensure that the named <config-option> is valid
    if [ "${configOption}" != "all"               -a \
         "${configOption}" != "rm-all"            -a \
         "${configOption}" != "testconfig"        -a \
         "${configOption}" != "rm-testconfig"     -a \
         "${configOption}" != "scenarioconfig"    -a \
         "${configOption}" != "rm-scenarioconfig"    ]
    then
	# log "invalid attribute value: --config-option ${configOption}"
	echo "invalid attribute value: --config-option ${configOption}"
	usage
    fi

    # ensure that dma was named, and is dns resolvable
    if [ "${dma}x" = "x" ]
    then
	# log "required argument was not given: --gk_id <dma>"
	echo "required argument was not given: --gk_id <dma>"
	usage
    else
	#dmaip=`nslookup ${dma} | awk '/^Address: / {print $2}'`
	dmaip=$dma
	if [ "${dmaip}x" = "x" ]
	then
	    # log "invalid attribute value: --dma ${dma}"
	    echo "invalid attribute value: --dma ${dma}"
	    usage
	fi
    fi
    
    # ensure that all named mcu values are dns resolvable
    if [ "${mcuList}x" = "x" ]
    then
	# log "warning: this scenario requires MCUs however none were specified"
	# log "         (The following argument may be used to specify an MCU: --mcu <mcu>)"
	echo "warning: this scenario requires MCUs however none were specified"
	echo "         (The following argument may be used to specify an MCU: --mcu <mcu>)"
    else
	for mcu in ${mcuList};
	do
	    ip=`nslookup ${mcu} | awk '/^Address: / {print $2}'`
	    if [ "${ip}x" = "x" ]
	    then
		# log "invalid attribute value: --mcu ${mcu}"
		echo "invalid attribute value: --mcu ${mcu}"
		usage
	    fi
	done
    fi
    
    # trace "exit parseParms"
    echo "exit parseParms"
}


########################################
########################################
# trace "entr certification_tiny_vmr:configure.sh:<global> ($*)"
echo "entr certification_tiny_vmr:configure.sh:<global> ($*)"

parseParms $*

####
# >>>> mdw working-here:
#      perhaps, these should be optional parameters rather than constants
# e164prefix='100'
# vmruser='locvmrh323din'
# numvmrs='1000'
# vmrstart='4000000'

e164prefix='101'
vmruser='audlocvmrh323din'
numvmrs='1000'
vmrstart='4000000'

#### >>> mdw working-here
#### it would be better to fixup the *tools so that they do not throw exceptions after giving an error message
#### it would be better to fixup the *tools so that they took the mcuuser and mcupassword as parameters,
#### rather than implicitly knowing the SUPPORT/SUPPORT16 values.
usr='SUPPORT'
pwd='SUPPORT16'
dmaapiusr='admin'
#dmaapipwd='admin'
dmaapipwd='Polycom12#$'

# >>>> mdw working-here:
#      perhaps, these should be optional parameters rather than constants
usr='SUPPORT'
pwd='SUPPORT16'


#### >>> mdw working-here
#### it would be better to fixup the *tools so that they do not throw exceptions after giving an error message


### testconfig specific configurations (may be shared with other scenarios)
if [ "${configOption}" = "testconfig" -o "${configOption}" = "all" ]
then
    # add mcus
    for mcu in ${mcuList};
    do
	# log "adding mcu ${mcu} to ${dma}"
	echo "adding mcu ${mcu} to ${dma}"
	mcuip=`nslookup ${mcu} | awk '/^Address: / {print $2}'`
	java -jar ${jardir}/dma-api.jar -a ${dmaip} -t mcus add ${mcuip} ${mcu} ${usr} ${pwd} 
    done
fi
if [ "${configOption}" = "rm-testconfig" -o "${configOption}" = "rm-all" ]
then
    # remove mcus
    for mcu in ${mcuList};
    do
	# log "removing mcu ${mcu} from ${dma}"
	echo "removing mcu ${mcu} from ${dma}"
	mcuip=`nslookup ${mcu} | awk '/^Address: / {print $2}'`
	java -jar ${jardir}/dma-api.jar -a ${dmaip} -t mcus remove ${mcuip} 
    done 
fi


### scenario specific configurations (not shared)
if [ "${configOption}" = "scenarioonfig" -o "${configOption}" = "all" ]
then
    # log "adding user ${vmruser} to ${dma}"
    echo "adding user ${vmruser} to ${dma}"
    java -jar ${jardir}/dma-api.jar -a ${dmaip} -t users add ${vmruser} 

    # log "adding ${numvmrs} vmrs starting with ${e164prefix}4000000 to ${dma}"
    echo "adding ${numvmrs} vmrs starting with ${e164prefix}4000000 to ${dma}"
    java -jar ${jardir}/dma-api.jar -a ${dmaip} -t vmrs --user ${vmruser}  add ${numvmrs} ${e164prefix}4000000 > /dev/null
fi
if [ "${configOption}" = "rm-scenarioonfig" -o "${configOption}" = "rm-all" ]
then
    # log "removing all vmrs owned by ${vmruser} from ${dma}"
    echo "removing all vmrs owned by ${vmruser} from ${dma}"
    java -jar ${jardir}/dma-api.jar -a ${dmaip} -t vmrs  --user ${vmruser} removeall > /dev/null

    # log "removing user ${vmruser} from ${dma}"
    echo "removing user ${vmruser} from ${dma}"
    java -jar ${jardir}/dma-api.jar -a ${dmaip} -t users remove ${vmruser}
fi

# trace "exit certification_tiny_vmr:configure.sh:<global>"
echo "exit certification_tiny_vmr:configure.sh:<global>"
