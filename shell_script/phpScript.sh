echo "What PHP version do you want to install?"
read -r version 
apt-get install php$version php$version-mysql php$version-fpm php$version-cli php$version-common php$version-mcrypt php$version-mbstring php$version-curl php$version-gd
