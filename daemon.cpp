#include "daemon.h"

// https://stackoverflow.com/a/17955149/16029300
void mainSkeleton()
{
	pid_t pid;
	  
	pid = fork();
		 
	if (pid < 0)
		exit(EXIT_FAILURE);
		   
	if (pid > 0)
		exit(EXIT_SUCCESS);

	if (setsid() < 0)
		exit(EXIT_FAILURE);
	  
	  
	signal(SIGCHLD, SIG_IGN);
	signal(SIGHUP, SIG_IGN);
	
	pid = fork();
	 
	if (pid < 0)
		exit(EXIT_FAILURE);
	  
	if (pid > 0)
		exit(EXIT_SUCCESS);
	
	umask(0);  
	  
	chdir("/");
	
	for (int x = sysconf(_SC_OPEN_MAX); x>=0; x--)
		close (x);
	  
	openlog ("course", LOG_PID, LOG_DAEMON);
}
