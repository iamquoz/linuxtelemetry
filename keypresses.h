#include <thread>
#include <mutex>
#include <cstring>
#include <ctime>
#include <vector>

extern "C" {
#include <xdo.h>
}


struct event {
	std::time_t curr;
    Window focused;

    // yes, hacky, but helps avoid deadlocks further in
    std::string focusedName;

    std::string toString();
};

void windowChanges();

// both global variables
inline std::mutex locker;
inline std::vector<event> backlog;