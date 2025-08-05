#!/bin/bash
echo "=== Verifying Next.js Build ==="

echo "Build directory contents:"
ls -la .next/

echo -e "\nBuild ID:"
cat .next/BUILD_ID 2>/dev/null || echo "No BUILD_ID found"

echo -e "\nBuild size:"
du -sh .next/

echo -e "\nRebuild with verbose output:"
npm run build 2>&1 | tee build-verbose.log

echo -e "\nChecking for build errors:"
grep -i error build-verbose.log || echo "No build errors found" 