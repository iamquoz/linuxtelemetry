#include "networking.h"

void mainLoop(config c) {

	
	auto url = cpr::Url{c.server};
	auto header = cpr::Header{{"Content-Type", "text/plain"}};

	while (true) {
		
		sleep(c.updateCycle);
		locker.lock();
		
		for (auto i : backlog) {
			auto str = i.focusedName;
			auto body = cpr::Body{"{\n\"window\": \"", str.c_str(), "\",\n\"pc\": \"", c.pcname.c_str(), "\",\n\"time\": \"", std::to_string(i.curr).c_str(), "\"\n}"};
			cpr::Response r = cpr::Post(url, body, header);
			//std::cout << r.text << std::endl;
		}
		backlog.clear();
		locker.unlock();
	}
}