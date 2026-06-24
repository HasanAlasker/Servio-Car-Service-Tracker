#!/bin/bash

# Professional Test Runner for Servio
# Aggregates individual runs into a standard Jest-style summary report.

echo "🚀 Starting Servio Test Suite..."
echo "--------------------------------------------------"

# Initialize tracking
PASSED_SUITES=0
FAILED_SUITES=0
TOTAL_SUITES=0
PASSED_TESTS=0
FAILED_TESTS=0
TOTAL_TESTS=0
START_TIME=$(date +%s)

# Array to store failed suite names
FAILED_LIST=()

# Function to run a single test file
run_test() {
    local file=$1
    # Run jest and capture output to a temporary file
    local tmp_out=$(mktemp)
    node --max-old-space-size=4096 node_modules/.bin/jest "$file" --forceExit > "$tmp_out" 2>&1
    local status=$?
    
    # Extract test counts from Jest output using grep/sed
    # Looking for lines like: Tests:       2 passed, 2 total
    local p_tests=$(grep "Tests:" "$tmp_out" | grep -o "[0-9]* passed" | awk '{print $1}')
    local f_tests=$(grep "Tests:" "$tmp_out" | grep -o "[0-9]* failed" | awk '{print $1}')
    local t_tests=$(grep "Tests:" "$tmp_out" | grep -o "[0-9]* total" | awk '{print $1}')
    
    # Add to totals
    [ -n "$p_tests" ] && PASSED_TESTS=$((PASSED_TESTS + p_tests))
    [ -n "$f_tests" ] && FAILED_TESTS=$((FAILED_TESTS + f_tests))
    [ -n "$t_tests" ] && TOTAL_TESTS=$((TOTAL_TESTS + t_tests))
    
    TOTAL_SUITES=$((TOTAL_SUITES + 1))
    
    if [ $status -eq 0 ]; then
        echo " PASS  $file"
        PASSED_SUITES=$((PASSED_SUITES + 1))
    else
        echo " FAIL  $file"
        FAILED_SUITES=$((FAILED_SUITES + 1))
        FAILED_LIST+=("$file")
        # Print the error if it failed
        cat "$tmp_out" | grep -A 5 "●" 
    fi
    rm "$tmp_out"
}

# Run all tests
while IFS= read -r -d '' file; do
    run_test "$file"
done < <(find __tests__ -name "*.test.js" -print0)

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Final Report in standard Jest format
echo ""
if [ $FAILED_SUITES -gt 0 ]; then
    echo -e "\033[1;31mTest Suites: $FAILED_SUITES failed, $PASSED_SUITES passed, $TOTAL_SUITES total\033[0m"
    echo -e "\033[1;31mTests:       $FAILED_TESTS failed, $PASSED_TESTS passed, $TOTAL_TESTS total\033[0m"
else
    echo -e "\033[1;32mTest Suites: $PASSED_SUITES passed, $TOTAL_SUITES total\033[0m"
    echo -e "\033[1;32mTests:       $PASSED_TESTS passed, $TOTAL_TESTS total\033[0m"
fi
echo "Snapshots:   0 total"
echo "Time:        ${DURATION}s"
echo "Ran all test suites."

if [ $FAILED_SUITES -gt 0 ]; then
    exit 1
fi
