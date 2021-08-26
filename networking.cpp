#include "networking.h"

void mainLoop(config c) {

	httplib::Client cli{c.server};
	
	while (true) {
		
		sleep(c.updateCycle);
		locker.lock();
		
		for (auto i : backlog) {
			// "jsonify" the payload
			/*
			{
				"window": i.focusedName.c_str(),
				"pc": c.pcname.c_str(),
				"time": std::to_string(i.curr).c_str()
			}
			*/
			std::string payload = (
				"{\n\"window\": \"" + i.focusedName 
				+ "\",\n\"pc\": \"" + c.pcname 
				+ "\",\n\"time\": \"" + std::to_string(i.curr)
				+ "\"\n}");

			auto res = cli.Post("/upload", payload, "application/json");
		}
		// remove everything from the vector to not repeat payloads
		backlog.clear();
		locker.unlock();
	}
}