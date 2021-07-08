#include "networking.h"

void mainLoop(config c) {

	int counter= 0;

	auto url = cpr::Url{c.server};
	auto header = cpr::Header{{"Content-Type", "text/plain"}};
	
    while (true) {
		printf("count: %d\n", counter);
		counter++;
        sleep(c.updateCycle);

        for (auto i : getVec()) {
			printf("%d\n\n", i.focused);
			auto str = windowToName(i.focused);
			auto payload = cpr::Multipart {
				{"window", cpr::Buffer{str.c_str(), str.c_str() + str.length(), ""}},
				{"time", i.curr}
			};

			auto body = cpr::Body{str.c_str(), str.length()};
			cpr::Response r = cpr::Post(url, payload);
			std::cout << r.text << std::endl;
		}
    }
    
}