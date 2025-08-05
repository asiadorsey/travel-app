#!/bin/bash
echo "=== Checking for Node.js Crashes ==="

echo "Recent system logs for node processes:"
sudo log show --predicate 'process == "node"' --last 10m 2>/dev/null || echo "No recent node logs"

echo -e "\nCrash reports:"
ls -la ~/Library/Logs/DiagnosticReports/*node* 2>/dev/null || echo "No crash reports found"

echo -e "\nCore dumps:"
ls -la /cores/core.* 2>/dev/null || echo "No core dumps found"

echo -e "\nSystem limits:"
ulimit -a 