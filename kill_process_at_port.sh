port=$1
procid=$(sudo lsof -n -i :$port)
echo "Killing process Id: $procid"
sudo kill -9 $procid
