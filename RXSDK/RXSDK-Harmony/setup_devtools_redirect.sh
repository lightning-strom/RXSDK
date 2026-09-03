#!/bin/bash  
  
# # 查找包含 devtools 的 UNIX 套接字，并提取套接字名称  
# # 注意：这里我们假设只有一个相关的套接字名称，或者我们只关心第一个找到的  
# SOCKET_NAME=$(hdc shell cat /proc/net/unix | grep devtools | head -n 1 | awk '{print $NF}' | cut -d'@' -f2)  
  
# # 检查是否找到了套接字名称  
# if [ -z "$SOCKET_NAME" ]; then  
#     echo "没有找到包含 devtools 的 UNIX 套接字。"  
#     exit 1  
# fi  
  
# # 假设我们要重定向到 TCP 端口 9222  
# TCP_PORT=9222  
  
# # 检查是否已经存在重定向（可选，取决于你的需求）  
# # 注意：这个检查可能需要你根据 hdc fport 的实际输出来定制  
# # ALREADY_REDIRECTED=$(...)  # 这里需要填写适当的命令来检查重定向  
# # if [ ! -z "$ALREADY_REDIRECTED" ]; then  
# #     echo "TCP 端口 $TCP_PORT 已经重定向到 $SOCKET_NAME。"  
# #     exit 0  
# # fi  
  
# # 执行 hdc fport 命令来设置重定向  
# echo "正在设置 TCP 端口 $TCP_PORT 到 UNIX 套接字 $SOCKET_NAME"  
# hdc fport tcp:$TCP_PORT localabstract:$SOCKET_NAME  
  


# 初始 TCP 端口  
BASE_TCP_PORT=9222  
  
# 从 /proc/net/unix 中提取包含 devtools 的 UNIX 套接字名称  
# SOCKET_NAMES=$(hdc shell cat /proc/net/unix | grep devtools | awk '{print $NF}' | cut -d'@' -f2)  
SOCKET_NAMES=$(hdc shell cat /proc/net/unix | grep devtools | awk -F'@' '{if (!seen[$NF]++) print $NF}')  

  
# 将 SOCKET_NAMES 转换为数组（假设 IFS 尚未被修改）  
IFS=$'\n' read -r -d '' -a sockets <<< "$SOCKET_NAMES"  
unset IFS  
  
# 遍历数组中的每个套接字名称，并设置递增的 TCP 端口重定向  
for (( i=0; i<${#sockets[@]}; i++ )); do  
    SOCKET_NAME=${sockets[$i]}  
    TCP_PORT=$((BASE_TCP_PORT + i))  

 
    echo "正在设置 TCP 端口 $TCP_PORT 到 UNIX 套接字 $SOCKET_NAME"  
    hdc fport tcp:$TCP_PORT localabstract:$SOCKET_NAME  
 

    # output=$(hdc fport ls)  


done  
  
hdc shell cat /proc/net/unix | grep devtools
# # hdc shell ps -ef | grep "com.ruixue"
hdc fport ls
 
