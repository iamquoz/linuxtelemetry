sudo apt install xdotool-dev
sudo apt install libconfig++-dev
sudo apt install libX11-dev

git clone https://github.com/whoshuu/cpr.git
cd cpr
mkdir build && cd build
cmake ..
make
sudo make install

