#include "keypresses.h"

xdo_t* p_xdo = xdo_new(NULL);

std::string windowToName(Window w) {
	if (w == 0) 
		return "unknown";
	
	FILE *cmd=popen((std::string("cat /proc/") + std::to_string(xdo_get_pid_window(p_xdo, w)) + "/comm").c_str(), "r");
    char result[50];
    fgets(result, sizeof(result), cmd);
	result[strlen(result)-1] = 0;
    pclose(cmd);
	return result;
}

void windowChanges() {
	Window last;
	xdo_get_active_window(p_xdo, &last);
	
	while (true) {
		Window focused;
		// we really only need to get the current window every 300ms or so
		usleep(300);
		
		xdo_get_active_window(p_xdo, &focused);
		
		if (last != focused) {
			locker.lock();
			backlog.push_back({std::time(0), focused, windowToName(focused)});
			last = backlog.back().focused;
			locker.unlock();
		
		}
	}

};