echo "URL:"
read -r url

echo "Text to find:"
read -r tag

# Use grep without -q and capture its output
matches=$(wget -O - "$url" | grep "$tag")

# Check if grep found any matches
if [ -n "$matches" ]; then
    echo "Text found:"
    echo "$matches"
else
    echo "Text not found"
fi


# echo "URL:"
# read -r url
#
# echo "Text to find:"
# read -r tag
# wget -O - $url | grep -q $tag
# if [ $? -eq 0 ]; then
#     echo "Text found: " $?
# else
#     echo "Text not found"
# fi
