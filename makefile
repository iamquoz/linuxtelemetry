CC = g++
FLAGS = -lX11 -pthread -std=c++17 -lxdo -lconfig++
SRC = $(wildcard *.cpp)

build: $(SRC)
	${CC} -o course.o $^ ${FLAGS}
