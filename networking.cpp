#include "networking.h"

void mainLoop(config c) {

	auto url = cpr::Url{c.server};
	auto header = cpr::Header{{"Content-Type", "text/plain"}};

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
			auto body = cpr::Body{"{\n\"window\": \"", i.focusedName.c_str(), "\",\n\"pc\": \"", c.pcname.c_str(), "\",\n\"time\": \"", std::to_string(i.curr).c_str(), "\"\n}"};
			cpr::Post(url, body, header);
		}
		// remove everything from the vector to not repeat payloads
		backlog.clear();
		locker.unlock();
	}
}