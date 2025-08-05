#!/bin/bash
echo "=== Starting Process Monitor ===" 
# Monitor all Node.js related process activity
sudo fs_usage -w -f pathname | grep -E "(node|next)" &
PID1=$!

# Monitor system calls for network operations  
sudo dtruss -f 2>&1 | grep -E "(bind|listen|socket|connect)" &
PID2=$!

echo "Process monitoring started (PIDs: $PID1, $PID2)"
echo "Press Ctrl+C to stop monitoring"

trap "kill $PID1 $PID2 2>/dev/null" EXIT
wait 