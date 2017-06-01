#!/usr/bin/env bash

clear

echo -e "\033[38;1m#### Reader Critics Test Suite ####\033[0m"
echo

### Process command line parameters and configure test suite

while [ $# -gt 0 ]; do	# Until you run out of parameters
	case "$1" in
		--libs)
			DONT_TEST_ALL=true
			TEST_LIBS=true
			;;
		--base)
			DONT_TEST_ALL=true
			TEST_BASE=true
			;;
		--frontend)
			DONT_TEST_ALL=true
			TEST_FRONTEND=true
			;;
	esac
	shift
done

MOCHA="node_modules/.bin/mocha --opts"

export NODE_ENV="test"
export DEBUG=${DEBUG:-"*,-babel,-mocha:*"}

### Global test runners, save return code

EXITCODE=0

### Run Mocha

runMocha()
{
	echo -e "\033[1;38;5;214mTesting ${2} ...\033[0m"

	node_modules/.bin/mocha --opts ${1}
	RETURN_VALUE=$?

	if [ ${RETURN_VALUE} -ne 0 ] ; then
		EXITCODE=${RETURN_VALUE}
	fi
}

### Run Nightwatch

runNightwatch()
{
	echo -e "\033[1;38;5;214mTesting ${2} ...\033[0m"
}

### Test parts

testLibraries()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_LIBS ]) ; then return ; fi
	runMocha test/mocha-libs.opts "Libraries"
}

testBaseSource()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_BASE ]) ; then return ; fi
	runMocha test/mocha-base.opts "Base Sources"
}

testFrontend()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_FRONTEND ]) ; then return ; fi
	runNightwatch 'narf' "Frontend"
}

### Execute all test suites

runAllTests()
{
	testLibraries
	testBaseSource
	testFrontend
}

### Return global exit code for CI service

runAllTests

echo
exit ${EXITCODE}
