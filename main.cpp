#include "networking.h"
#include "daemon.h"

int main() {
	config abc;

	//idk it seems to crash less
	XInitThreads();

	mainSkeleton();
	
	// daemon code
	while (true) {
			
		std::thread windowThread(windowChanges);
		std::thread networkLoop(mainLoop, abc);


		windowThread.join();
		networkLoop.join();

	}

	// send everything that's left 
	mainLoop(abc);

	closelog();
	return 0;
};