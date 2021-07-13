#include "networking.h"

void mainLoop(config c) {

	
	auto url = cpr::Url{c.server};

	while (true) {
		
		sleep(c.updateCycle);
		locker.lock();
		
		for (auto i : backlog) {
			auto str = i.focusedName;
			auto payload = cpr::Multipart {
				{"window", cpr::Buffer{str.c_str(), str.c_str() + str.length(), ""}},
				{"pc", cpr::Buffer{c.pcname.c_str(), c.pcname.c_str() + c.pcname.length(), ""}},
				{"time", i.curr},
			};
			auto body = cpr::Body{str.c_str(), str.length()};
			cpr::Response r = cpr::Post(url, payload);
		}
		backlog.clear();
		locker.unlock();
	}
}