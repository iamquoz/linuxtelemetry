#include "keypresses.h"

Display *dpy = XOpenDisplay(":0");
xdo_t* p_xdo = xdo_new(NULL);

bool keypressCheck(KeySym ks) {
    char keys[32];
    XQueryKeymap(dpy, keys);
	KeyCode kc2 = XKeysymToKeycode(dpy, ks);
	bool isPressed = !!(keys[kc2 >> 3] & (1 << (kc2 & 7)));
	//XCloseDisplay(dpy);
	return isPressed;
}

bool altPressed() {
	// also might wanna check for Super/Win
	return keypressCheck(XK_Alt_L) || keypressCheck(XK_Alt_R)
	|| keypressCheck(XK_Super_L) || keypressCheck(XK_Super_R);
}

bool tabPressed() {
	return keypressCheck(XK_Tab);
}

std::string timeStampToHReadble(const time_t rawtime)
{
    struct tm * dt;
    dt = localtime(&rawtime);
    return asctime(dt);
}

std::string windowToName(Window w) {
	//xdo_get_focused_window(p_xdo, )
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

void pwn(Window win)
{
    unsigned int nchildren, i;
    Window rw, pw, *cw;
    char *name;

    printf("%s", windowToName(win).c_str());
    if (XQueryTree(dpy, win, &rw, &pw, &cw, &nchildren)) {
        for (i = 0; i < nchildren; ++i)
            pwn(cw[i]);
        XFree(cw);
    }
}

void keypresses() {

	//pwn(DefaultRootWindow(dpy));
	while (true) {
		bool lastInput = altPressed() && tabPressed();
		Window focused;
		xdo_get_active_window(p_xdo, &focused);
		if (backlog.back().focused != focused) {
			backlog.push_back({std::time(0), focused});
			display(backlog.back());
		}
	}
};