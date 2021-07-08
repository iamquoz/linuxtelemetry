#include "keypresses.h"

Display *dpy = XOpenDisplay(":0");
xdo_t* p_xdo = xdo_new(NULL);

std::vector<event> backlog{{0, 0}};

std::vector<event> getVec() {
	std::vector<event> copy = backlog;
	//backlog.clear();
	//backlog.push_back({0, 0});
	return copy;
}

std::string timeStampToHReadble(const time_t rawtime)
{
    struct tm * dt;
    dt = localtime(&rawtime);
    return asctime(dt);
}

std::string windowToName(Window w) {
	if (w == 0) 
		return "unknown";

	XInitThreads();
	FILE *cmd=popen((std::string("cat /proc/") + std::to_string(xdo_get_pid_window(p_xdo, w)) + "/comm").c_str(), "r");
    char result[50];
    fgets(result, sizeof(result), cmd);
	result[strlen(result)-1] = 0;
    pclose(cmd);
	return result;
}


void display(std::vector<event> bl) {
	for (auto i : bl)
		std::cout << "switched to "<< windowToName(i.focused) << " at " << timeStampToHReadble(i.curr) << std::endl;
	
}

void display(event i) {
	std::cout << "switched to "<< windowToName(i.focused) << " at " << timeStampToHReadble(i.curr) << std::endl;
}

void windowChanges() {
	XInitThreads();

	while (true) {
		Window focused;
		xdo_get_active_window(p_xdo, &focused);
		if (backlog.back().focused != focused) {
			backlog.push_back({std::time(0), focused});
			//display(backlog.back());
		}
	}
};

std::string event::toString() {
	return windowToName(this->focused) + " " + timeStampToHReadble(this->curr);
}