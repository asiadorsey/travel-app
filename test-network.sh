#!/bin/bash
echo "=== Testing Network Stack ==="

echo "Network routing:"
netstat -rn | head -10

echo -e "\nLoopback interface:"
ifconfig lo0

echo -e "\nPort 3001 usage:"
sudo lsof -i :3001 2>/dev/null || echo "Port 3001 is free"
sudo netstat -anp tcp | grep 3001 || echo "No TCP connections on 3001"

echo -e "\nNode.js memory test:"
node -e "console.log('Node.js working:', process.memoryUsage())" 2>/dev/null || echo "Node.js basic test failed" 