#include "networking.h"

void mainLoop(config c) {

	
	auto url = cpr::Url{c.server};
	auto header = cpr::Header{{"Content-Type", "text/plain"}};

	while (true) {
		
		sleep(c.updateCycle);
		printf("lock net b\n");
		locker.lock();
		printf("lock net e\n");
		printf("network %ld\n", backlog.size());
			//display(backlog.back());

		printf("1\n");
		for (auto i : backlog) {
			printf("2\n");
			auto str = windowToName(i.focused);
			printf("3\n");
			auto payload = cpr::Multipart {
				{"window", cpr::Buffer{str.c_str(), str.c_str() + str.length(), ""}},
				{"pc", cpr::Buffer{c.pcname.c_str(), c.pcname.c_str() + c.pcname.length(), ""}},
				{"time", i.curr},
			};
			printf("4\n");
			auto body = cpr::Body{str.c_str(), str.length()};
			printf("5\n");
			cpr::Response r = cpr::Post(url, payload);
			printf("6\n");
			//std::cout << r.text << std::endl;
		}
		backlog.clear();
		printf("unlock net b\n");
		locker.unlock();
		printf("unlock net e\n");
	}
}