#include <libconfig.h++>
#include <unistd.h>
#include <iostream>
#include <string>

struct config {
	std::string server;
	unsigned updateCycle;
	std::string pcname;

	config() {
		libconfig::Config cfg;

		try {
			cfg.readFile((std::string(getenv("HOME")) + std::string("/.config/coursetelemetry.cfg")).c_str());
		}
		catch(const libconfig::FileIOException &fioex) {
			std::cerr << "I/O error while reading file." << std::endl;
			return;
		}
		catch(const libconfig::ParseException &pex) {
			std::cerr << "Parse error at " << pex.getFile() << ":" << pex.getLine()
			  << " - " << pex.getError() << std::endl;
		return;
  		}
		// catch(...) {
		// 	server = "default.server";
		// 	updateCycle = 600;

		// 	printf("\n%s, %d\n", server.c_str(), updateCycle);
		// 	return;
		// }
		try {
			server = cfg.lookup("server").c_str();
		}
		catch(...) {
			server = "default server";
		}

		try {
			updateCycle = cfg.lookup("update");
		}
		catch(...) {
			updateCycle = 600;
		}

		try {
			pcname = cfg.lookup("pcname").c_str();
		}
		catch(...) {
			char hostname[256];
			hostname[255] = '\0';
			gethostname(hostname, 255);
			pcname = hostname;
		}
		printf("\n%s, %s, %d\n", server.c_str(), pcname.c_str(), updateCycle);
	}
};
