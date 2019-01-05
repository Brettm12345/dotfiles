#!/bin/bash

function usage {
        echo "Usage: $(basename $0) <filename>
Upload an image to ptpimg.me and output its URL to stdout.
If xsel or xclip is available, the URL is put on the X selection for easy pasting." >&2
}

if [ $# -ne 1 ]; then
        echo "No file specified" >&2
        exit 1
elif [ ! -f "$1" ]; then
        echo "File \"$1\" not found" >&2
        exit 1
fi

# check for curl
which curl >/dev/null 2>/dev/null || {
        echo "Couln't find curl, which is required." >&2
        exit 1
}

# upload the image
response=$(curl -F "uploadfile=@$1" "http://ptpimg.me/index.php?type=uploadv3&key=5e55879a-aefb-4491-83e7-ab473d38d256" 2>/dev/null)
if [ $? -ne 0 ]; then
        echo "Upload failed" >&2
        exit 2
fi

# parse the response and output our stuff
status=$(echo $response | sed 's/[\"\{\}\[\]]*//g' | cut -d, -f1 | cut -d: -f2)
if [ $status -ne 1 ]; then
        echo "Some sort of error occurred" >&2
        exit 1
fi
img=$(echo $response | sed 's/[\"\{\}\[\]]*//g' | cut -d, -f2 | cut -d: -f2)
ext=$(echo $response | sed 's/[\"\{\}\[\]]*//g' | cut -d, -f3 | cut -d: -f2)

file="$img.$ext"
url="http://ptpimg.me/$file"

echo $url

# put the URL on the clipboard if we have xsel or xclip
if [ $DISPLAY ]; then
        { which xsel >/dev/null 2>/dev/null && echo -n $url | xsel; } \
                || { which xclip >/dev/null 2>/dev/null && echo -n $url | xclip; } \
                || echo "Haven't copied to the clipboard: no xsel or xclip" >&2
else
        echo "Haven't copied to the clipboard: no \$DISPLAY" >&2
    fi
