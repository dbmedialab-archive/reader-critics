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
	#	--tags)
	#		shift
	#		if [ $# -lt 1 ]; then
	#			echo "The --tags parameter expects a following string declaring the test tags"
	#			exit 3
	#		fi
	#		IFS=',' read -r -a TAGS <<< "$1"
	#		;;
	esac
	shift
done

export NODE_ENV="test"
export DEBUG=${DEBUG:-"*,-babel,-mocha:*"}

### Global test runners, save return code

EXITCODE=0

##### MOCHA

runMocha()
{
	echo -e "\033[1;38;5;214mTesting ${2} ...\033[0m"

	# Run Mocha
	node_modules/.bin/mocha --opts ${1}
	RETURN_VALUE=$?

	# Catch exit code
	if [ ${RETURN_VALUE} -ne 0 ] ; then
		EXITCODE=${RETURN_VALUE}
	fi
}

##### NIGHTWATCH

runNightwatch()
{
	echo -e "\033[1;38;5;214mTesting ${2} ...\033[0m"

	# Test tags - commented out as long as the Mocha runner crashes with tags defined
	#TAGS_CMDL=""
	#
	#if [ ! -z ${TAGS} ]; then
	#	for THIS_TAG in "${TAGS[@]}"
	#	do
	#		TAGS_CMDL="${TAGS_CMDL} --tag ${THIS_TAG}"
	#	done
	#fi

	# Run Nightwatch
	node_modules/.bin/nightwatch --config ${1} # ${TAGS_CMDL}
	RETURN_VALUE=$?

	# Catch exit code
	if [ ${RETURN_VALUE} -ne 0 ] ; then
		EXITCODE=${RETURN_VALUE}
	fi
}

### Test parts

testLibraries()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_LIBS ]) ; then return ; fi
	runMocha "test/mocha-libs.opts" "Libraries"
}

testBaseSource()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_BASE ]) ; then return ; fi
	runMocha "test/mocha-base.opts" "Base Sources"
}

testFrontend()
{
	if [ $EXITCODE -ne 0 ] || ([ $DONT_TEST_ALL ] && [ ! $TEST_FRONTEND ]) ; then return ; fi
	runNightwatch "test/nightwatch-frontend.js" "Frontend"
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
