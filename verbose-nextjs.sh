#!/bin/bash
echo "=== Starting Next.js with Maximum Verbosity ===" 
DEBUG=* NEXT_DEBUG=1 NODE_OPTIONS="--trace-warnings --trace-uncaught --trace-exits" npm start 2>&1 | tee nextjs-debug.log 