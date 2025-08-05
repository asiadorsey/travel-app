#!/bin/bash
echo "=== Monitoring Port 3001 ===" 
while true; do
    echo "--- $(date) ---"
    lsof -i :3001 2>/dev/null || echo "No process on port 3001"
    echo "Active node processes:"
    ps aux | grep -E '(node|next)' | grep -v grep | head -5
    echo ""
    sleep 0.5
done 