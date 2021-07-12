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
    
    std::string toString();
};

void windowChanges();
std::string windowToName(Window);
void display(std::vector<event>);
void display(event);

inline std::mutex locker;
inline std::vector<event> backlog;