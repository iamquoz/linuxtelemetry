#include <omp.h>
#include <iostream>
#include "keypresses.h"


// int main(int argc, char* argv[]) {
// 	printf("%d\n", argc);

// 	//skeleton_daemon();
	
// 	while (1)
// 	{
// 		#pragma omp parallel sections
// 		{
// 			#pragma omp section
// 			{
// 				printf("a\n");
// 			}
// 			#pragma omp section 
// 			{
// 				sleep(1);
// 				printf("b\n");
// 			}
// 		}
// 		syslog (LOG_NOTICE, "First daemon started.");
// 		//sleep (20);
// 	}
   
// 	syslog (LOG_NOTICE, "First daemon terminated.");
// 	closelog();
	
// 	return EXIT_SUCCESS;
// }S

int main() {
	keypresses();
    return 0;
};
