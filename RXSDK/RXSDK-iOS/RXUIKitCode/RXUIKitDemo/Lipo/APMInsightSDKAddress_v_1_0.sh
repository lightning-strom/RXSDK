#!/usr/bin/env bash

APMSDKAssetCrashPath="${PODS_ROOT}/RangersAPM/RangersAPM/Assets/Crash"
addressRangeFileName="${APMSDKAssetCrashPath}/APMInsightCrash.bundle/APMInsightSDKAddressRange.plist"

plistLineNum=0
keysLineNum=()
arrayStartLineNum=()
arrayEndLineNum=()
while read line
do
    ((plistLineNum++))

    if [[ $line =~ "<key>" ]]; then
        keysLineNum[${#keysLineNum[@]}]=$plistLineNum
    elif [[ $line =~ "<array>" ]]; then
        arrayStartLineNum[${#arrayStartLineNum[@]}]=$plistLineNum
    elif [[ $line =~ "</array>" ]]; then
        arrayEndLineNum[${#arrayEndLineNum[@]}]=$plistLineNum
    fi
done < "${addressRangeFileName}"

errorCount=$[${#keysLineNum[@]}-${#arrayEndLineNum[@]}]
if [[ ${errorCount} -gt 0 ]]; then
    errorLineNum=${keysLineNum[$[${#keysLineNum[@]}-${errorCount}]]}
    sed -i "" "${errorLineNum},\$d" "${addressRangeFileName}"
else
    sed -i "" '/^<\/dict>/,$d' "${addressRangeFileName}"
fi

function combineAddresses(){
    lastLineNum="0000"
    startAddress="0x0000"
    lastAddr="0x0000"
    lastSize="0x0000"
    while read line
    do
        read tmpLineNum tmpAddr tmpSize <<< $(echo $(echo ${line} | awk -F "[: ]" '{print $1" "$2" "$3}'))
        
        if [[ "${lastLineNum}" == "0000" ]]; then
            startAddress=${tmpAddr}
        else
            if [[ ! "${tmpLineNum}" == "$[${lastLineNum}+1]" ]]; then
                endAddress=`printf "0x%08x" $((${lastAddr}+${lastSize}))`
                echo "${lastLineNum}:${startAddress} ${endAddress}" >> "$2"
                startAddress=${tmpAddr}
            fi
        fi

        lastLineNum=${tmpLineNum}
        lastAddr=${tmpAddr}
        lastSize=${tmpSize}
    done < "$1"

    if [[ ! "${startAddress}" == "0x0000"  ]];
    then
        endAddress=`printf "0x%08x" $((${lastAddr}+${lastSize}))`
        echo "${lastLineNum}:${startAddress} ${endAddress}" >> "$2"
    fi

}

function writeAddressRangeFileFromLinkMap(){

    if [[ ! -f "$3" ]]; then
        echo "LinkMap for $4 not found!!!"
        return
    fi
    
    OBJSTART=`date +%s`;

    objectFile="${APMSDKAssetCrashPath}/APMInsightSDKAddressRangeTmp1.txt"
    if [[ -f "$objectFile" ]]; then
        rm "${objectFile}"
    fi
    touch "${objectFile}"

    grep -E "^\[.*\].*\/($1)\/.*" $3 >> "${objectFile}"

    OBJEND=`date +%s`;
    OBJTime=$((OBJEND-OBJSTART))
    echo "Grep object files cost $OBJTime s"

    symbolFile="${APMSDKAssetCrashPath}/APMInsightSDKAddressRangeTmp2.txt"
    if [[ -f "$symbolFile" ]]; then
        rm "${symbolFile}"
    fi
    touch "${symbolFile}"
    
    symbolsLineNum=$(grep -E -n "# Symbols:" $3 | head -1 | cut -d ":" -f 1)
    deadLineNum=$(grep -E -n "# Dead Stripped Symbols:" $3 | head -1 | cut -d ":" -f 1)
    
    allSymbols="${APMSDKAssetCrashPath}/APMInsightSDKAddressAllSymbols.txt"
    if [[ -f "${allSymbols}" ]]; then
        rm "${allSymbols}"
    fi
    touch "${allSymbols}"

    symbolTempFile="${APMSDKAssetCrashPath}/APMInsightSDKAddressRangeSymbolTemp.txt"
    if [[ -f "${symbolTempFile}" ]]; then
        rm "${symbolTempFile}"
    fi
    touch "${symbolTempFile}"

    sed -n "${symbolsLineNum},${deadLineNum}p" $3 > ${allSymbols}

    grep -v "0x.*0x.*(literal\sstring\:.?|CFString|objc-cat-list|pointer-to-literal-cstring|_OBJC_IVAR_\$_.*)" ${allSymbols} > ${symbolTempFile}

    rm "${allSymbols}"
    
    TEXTEND=`date +%s`;
    TEXTTime=$((TEXTEND-OBJEND))
    echo "Grep text section cost $TEXTTime s"

    regular="0000"
    count=0
    while read line
    do
        count=$[count+1]
        if [[ $count -ge 500 ]]; then
            regular="${regular})\]"
            grep -E -n "${regular}" ${symbolTempFile} >> $symbolFile
            regular="0000"
            count=0
        fi
        
        serial=`echo ${line} | cut -d "]" -f 1 | cut -b 2-`
        if [[ "${regular}" == "0000" ]]; then
            regular="0x.*0x.*\[(\s?${serial}"
        else
            regular="${regular}|\s?${serial}"
        fi
    done < $objectFile
    regular="${regular})\]"
    grep -E -n "${regular}" ${symbolTempFile} >> $symbolFile

    SYBEND=`date +%s`;
    SYBTime=$((SYBEND-TEXTEND))
    echo "Grep SDK symbols cost $SYBTime s"

    rm "${symbolTempFile}"

    sort -n -k 1 -t : $symbolFile -o $symbolFile

    SORTEND=`date +%s`;
    SORTTime=$((SORTEND-SYBEND))
    echo "sort SDK symbols cost $SORTTime s"
    
    if [[ -f "${objectFile}" ]]; then
        rm "${objectFile}"
    fi

    startLineNum=0
    endLineNum=0
    tempLineNum=0
    while read line
    do
        ((tempLineNum++))
        if [ "${line}" == "<key>${2}_${4}</key>" ]
        then
            startLineNum=$tempLineNum
            continue
        fi
        
        if [ ! "$startLineNum" == 0 ]
        then
            if [ "${line}" == "</array>" ]
            then
                endLineNum=$tempLineNum
                break
            fi
        fi
    done < "${addressRangeFileName}"
    sed -i "" "$startLineNum,${endLineNum}d" "${addressRangeFileName}"

    echo "<key>${2}_${4}</key>
<array>" >> "${addressRangeFileName}"
    
    threadCount=10 
    linesCount=`awk 'END{print NR}' ${symbolFile}`
    lineExceptThread=`awk 'BEGIN{printf "%.2f\n",'$linesCount'/'$threadCount'}'`
    linesCountPerFile=`echo $((${lineExceptThread//.*/+1}))`
    cd $APMSDKAssetCrashPath
    split -l ${linesCountPerFile} -a 1 ${symbolFile} AddressMergeTmp_

    for ((i=0;i<${threadCount};i++))
    do
    {
        suffixNum=$[i+97]
        suffix=$(printf \\x`printf %x $suffixNum`)
        if [[ -f "AddressMergeTmp_${suffix}" ]]; then
            touch "AddressMerge_$i"
            combineAddresses AddressMergeTmp_${suffix} AddressMerge_$i
            rm "AddressMergeTmp_${suffix}"
        fi
    }&
    done
    wait
    
    MERGEEND=`date +%s`;
    MERGETime=$((MERGEEND-SORTEND))
    echo "Merge part cost $MERGETime s"

    startAddress="0x0000"
    endAddress="0x0000"
    for ((i=0;i<${threadCount};i++))
    do
    {
        if [[ -f "AddressMerge_$i" ]]; then
            while read line
            do
                read tmpStartAddr tmpEndAddr <<< $(echo $(echo ${line} | awk -F "[: ]" '{print $2" "$3}'))
                
                if [ "${startAddress}" == "0x0000" ]
                then
                    startAddress=${tmpStartAddr}
                    endAddress=${tmpEndAddr}
                else
                    if [[ $(echo "${tmpStartAddr}" | tr '[:upper:]' '[:lower:]') == $(echo "${endAddress}" | tr '[:upper:]' '[:lower:]') ]]
                    then
                        endAddress=${tmpEndAddr}
                    else
                        thisSize=`printf "0x%08x" $((${endAddress}-${startAddress}))`
                        echo "<string>${startAddress}+${thisSize}</string>" >> "${addressRangeFileName}"
                        startAddress=${tmpStartAddr}
                        endAddress=${tmpEndAddr}
                    fi
                fi
            done < "AddressMerge_$i"
            rm "AddressMerge_$i"
        fi
    }
    done
    if [[ ! "${startAddress}" == "0x0000"  ]]
    then
        thisSize=`printf "0x%08x" $((${endAddress}-${startAddress}))`
        echo "<string>${startAddress}+${thisSize}</string>" >> "${addressRangeFileName}"
    fi

    MERGEALLEND=`date +%s`;
    MERGEALLTime=$((MERGEALLEND-MERGEEND))
    echo "Merge all cost $MERGEALLTime s"

    echo "</array>" >> "${addressRangeFileName}"
    
    if [[ -f "${symbolFile}" ]]; then
        rm "${symbolFile}"
    fi
    
}

function writeAddressRangeFile(){

    if [[ -z "$1" ]] || [[ -z "$2" ]]; then
        echo "SDKName or SDKAid is empty, return"
        return
    fi

    START=`date +%s`;

    # LINKMAP文件路径
    LINKMAP_ARM64=${LD_MAP_FILE_PATH//${CURRENT_ARCH}/arm64}
    LINKMAP_ARMV7=${LD_MAP_FILE_PATH//${CURRENT_ARCH}/armv7}

    if [[ -z "$LINKMAP_ARM64" ]] && [[ -z "$LINKMAP_ARMV7" ]]; then
        echo "LINKMAP path is empty, return"
        return
    fi

    writeAddressRangeFileFromLinkMap $1 $2 $LINKMAP_ARM64 "arm64"

    writeAddressRangeFileFromLinkMap $1 $2 $LINKMAP_ARMV7 "armv7"


    echo "SDK $2 write addressRange end"
    END=`date +%s`;
    time=$((END-START))
    echo "SDK $2 cost ${time}s"
}

# $SDKAid是在APMInsight平台上面申请的APPId，每个Aid输出一个addressRange文件，如果有多个Aid，请对每个Aid调用一次writeAddressRangeFile方法
# 如果多个SDK归属于同一个aid，则$SDKName中使用'|'把这些SDKName分隔开，即SDKName="SDK1|SDK2|SDK3"
SDKAid="234224"
SDKName="RangersAPM|UnionOpenPlatform|UnionOpenPlatform.framework"
writeAddressRangeFile $SDKName $SDKAid
#在这里添加其他的writeAddressRangeFile方法调用
#writeAddressRangeFile $SDKName $SDKAid

echo "</dict></plist>" >> "${addressRangeFileName}"
