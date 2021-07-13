#include <thread>
#include <mutex>
#include <cstring>
#include <ctime>
#include <vector>
#include <iostream>
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

inline std::mutex locker;
inline std::vector<event> backlog;