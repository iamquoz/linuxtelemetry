#include <X11/Xlib.h>
#include <X11/keysym.h>

#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/Xos.h>
#include <X11/Xatom.h>
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
std::vector<event> getVec();
std::string windowToName(Window);
