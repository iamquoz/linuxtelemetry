CC = g++
FLAGS = -lX11 -fopenmp -std=c++17 -lxdo
SRC = $(wildcard *.cpp)

build: $(SRC)
	${CC} -o course.o $^ ${FLAGS}