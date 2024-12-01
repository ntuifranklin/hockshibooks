#install unzip
sudo apt install unzip
# installs fnm (Fast Node Manager)
sudo curl -fsSL https://fnm.vercel.app/install | bash

# activate fnm
sudo source ~/.bashrc

# download and install Node.js
sudo fnm use --install-if-missing 22

# verifies the right Node.js version is in the environment
sudo node -v # should print `v22.11.0`

# verifies the right npm version is in the environment
sudo npm -v # should print `10.9.0`
