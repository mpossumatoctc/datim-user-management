#!/usr/bin/env bash

# Exit immediately upon non-zero exit status
set -e ; set -o pipefail

# Add src/bash to PATH as necessary
if ! [[ $PATH =~ /opt/bao/bin ]]; then 
  export PATH="$PATH:../../src/bash"
fi


#Gather DHIS credentials for `curl` calls:
source dhis_config

#Update Data Store
#TODO: curl --data "@./i18n.json" -v -H "Content-Type: application/json" -u admin:district http://<server>/api/dataStore/datim-user-management/i18n
#TODO: curl --data "@./stores.json" -v -H "Content-Type: application/json" -u admin:district http://<server>/api/dataStore/datim-user-management/stores
#EX: curl -X POST -H "Content-Type: text/plain" -u "${DHIS_USERNAME:?}:${DHIS_PASSWORD:?}" "${DHIS_BASEURL:?}/api/systemSettings/keyApprovalDataSetGroups" -d '[{"name": "MER Results","dataSets": ["STL4izfLznL","asHh1YkxBU5","i29foJcLY9Y","j1i6JjOpxEq","hIm0HGCKiPv","NJlAVhe4zjv","ovYEbELCknv","sCar694kKxH","j9bKklpTDBZ","ZaV4VSLstg7","vvHCWnhULAf","gZ1FgiGUlSj","xBRAscSmemV","VWdBdkfYntI"]},{"name": "MER Targets","dataSets": ["xJ06pxmxfU6","LBSk271pP7J","rDAUgkkexU1","IOarm0ctDVL","VjGqATduoEX","PHyD22loBQH","oYO9GvA05LE","xxo1G5V1JG2","AyFVOGbAvcH","tCIW2VFd8uu","JXKUYJqmyDd","qRvKHvlzNdv","lbwuIo56YoG","Om3TJBRH8G8"]}]'
#Ex: curl -X POST -H "Content-Type: text/plain" -u "${DHIS_USERNAME:?}:${DHIS_PASSWORD:?}" "${DHIS_BASEURL:?}/api/systemSettings/keyApprovalsDataSetDisplayRules" -d '[{"workflow":"MER Targets","matchPeriodOn":{"test":"^[0-9]{4}Oct$","comparator":"lt","value":"2016Oct"},"dataSets":["xJ06pxmxfU6","LBSk271pP7J","rDAUgkkexU1","IOarm0ctDVL","VjGqATduoEX","PHyD22loBQH","oYO9GvA05LE"]},{"workflow":"MER Targets","matchPeriodOn":{"test":"^[0-9]{4}Oct$","comparator":"gte","value":"2016Oct"},"dataSets":["xxo1G5V1JG2","AyFVOGbAvcH","tCIW2VFd8uu","JXKUYJqmyDd","qRvKHvlzNdv","lbwuIo56YoG","Om3TJBRH8G8"]},{"workflow":"MER Results","matchPeriodOn":{"test":"^[0-9]{4}Q[1-4]$","comparator":"lte","value":"2016Q2"},"dataSets":["STL4izfLznL","asHh1YkxBU5","i29foJcLY9Y","j1i6JjOpxEq","hIm0HGCKiPv","NJlAVhe4zjv","ovYEbELCknv"]},{"workflow":"MER Results","matchPeriodOn":{"test":"^[0-9]{4}Q[1-4]$","comparator":"gte","value":"2016Q3"},"dataSets":["sCar694kKxH","j9bKklpTDBZ","ZaV4VSLstg7","vvHCWnhULAf","gZ1FgiGUlSj","xBRAscSmemV","VWdBdkfYntI"]}]'

# Set the app to download and where to get it
app_key='user-management'
app_new_version='1.1.0'
app_new_url="https://github.com/mpossumatoctc/datim-user-management/raw/schema-refactor/releases/${app_new_version}/user-management.zip"

# Gather information about existing version of the app; folderName ensures
# existing URLs will remain the same after upgrade
app_name="$( dhis_api --quiet --api-request='apps' --quiet| jq --raw-output '.[] | select(.key == "'"$app_key"'") | .name' )"
app_version="$( dhis_api --quiet --api-request='apps' --quiet| jq --raw-output '.[] | select(.key == "'"$app_key"'") | .version' )"
app_folderName="$( dhis_api --quiet --api-request='apps' --quiet| jq --raw-output '.[] | select(.key == "'"$app_key"'") | .folderName' )"

# Only proceed if the new version is different than the existing version
if [[ $app_new_version != "$app_version" ]]; then

  # Download app as zip
  rm --force "/tmp/${app_folderName}.zip"
  app_new_version_dl=$(
    curl "${app_new_url}" \
      --silent \
      --location \
      --connect-timeout "30" \
      --max-time "120" \
      --header 'Accept: application/octet-stream' \
      --output "/tmp/${app_folderName}.zip" \
      --write-out "%{http_code}"
  )

  # Test http response and if file size is greater than 0 bytes
  if [[ $app_new_version_dl -ne 200 ]] || [[ ! -s "/tmp/${app_folderName}.zip" ]]; then
    echo "ERROR: Unable to download DHIS2 app \"${app_name}\", exiting..." >&2
    rm --force "/tmp/${app_folderName}.zip" &>/dev/null
    exit 1
  fi

  # Use additional curl headers for DHIS 2.21 and below
  CURL_ARGS_HEADERS=''
  if [[ $( dhis_build --version | sed 's/\.//g' ) -le 221 ]]; then
    # "Host" header
    appBaseUrl_HOSTNAME="$( dhis_api_setting --quiet --key='appBaseUrl' | sed -e 's%^http\(s\)\{0,1\}://%%' -e 's%:[0-9].*%%' -e 's%/.*$%%' )"
    # If appBaseUrl_HOSTNAME is localhost, null, or empty, set to the system hostname
    if [[ $appBaseUrl_HOSTNAME =~ ^localhost ]] || [[ $appBaseUrl_HOSTNAME =~ ^127\.0\.0\.1 ]] || [[ $appBaseUrl_HOSTNAME =~ ^::1 ]] || [[ $appBaseUrl_HOSTNAME =~ ^null$ ]] || [[ -z $appBaseUrl_HOSTNAME ]]; then
      appBaseUrl_HOSTNAME="$( hostname )"
    fi
    CURL_ARGS_HEADERS="--header 'Host: $appBaseUrl_HOSTNAME'"

    # "X-Forwarded-Proto" header
    appBaseUrl_PROTOCOL="$( dhis_api_setting --quiet --key='appBaseUrl' | awk -F: '{print $1}' )"
    # If appBaseUrl_PROTOCOL is null or empty, set to https
    if [[ $appBaseUrl_PROTOCOL =~ ^null$ ]] || [[ -z $appBaseUrl_PROTOCOL ]]; then
      appBaseUrl_PROTOCOL='https'
    fi
    CURL_ARGS_HEADERS="$CURL_ARGS_HEADERS --header 'X-Forwarded-Proto: $appBaseUrl_PROTOCOL'"
  fi

  # Upload and install app zip file, don't show empty line output
  CURL_ARGS="$CURL_ARGS_HEADERS --form file=@'/tmp/${app_folderName}.zip'" \
    dhis_api $DHIS_API_ARGS \
      --api-request='apps' \
      --request='POST'

  # Cleanup
  rm --force "/tmp/${app_folderName}.zip"

  # Clear cache
  dhis_api --request="POST" --api-request="maintenance/cache"
fi



exit 0