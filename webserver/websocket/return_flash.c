    #include <stdlib.h>  
    #include <sys/types.h>  
    #include <stdio.h>  
    #include <sys/socket.h>  
    #include <netinet/in.h>
    #include <arpa/inet.h>  
    #include <string.h>  
      
    int main()  
    {  
    int sfp,nfp; /* 定义两个描述符 */  
    struct sockaddr_in s_add,c_add,addr;  
    int sin_size;  
    unsigned short portnum=0x0088; /* 服务端使用端口 */  
      
   // printf("Hello,welcome to my server !\r\n");  
    sfp = socket(AF_INET, SOCK_STREAM, 0);  
    if(-1 == sfp)  
    {  
       // printf("socket fail ! \r\n");  
        return -1;  
    }  
    //printf("socket ok !\r\n");  
      
    /* 填充服务器端口地址信息，以便下面使用此地址和端口监听 */  
    bzero(&s_add,sizeof(struct sockaddr_in));  
    s_add.sin_family=AF_INET;  
    s_add.sin_addr.s_addr=htonl(INADDR_ANY); /* 这里地址使用全0，即所有 */  
    s_add.sin_port=htons(portnum);  
    /* 使用bind进行绑定端口 */  
    if(-1 == bind(sfp,(struct sockaddr *)(&s_add), sizeof(struct sockaddr)))  
    {  
        //printf("bind fail !\r\n");  
        return -1;  
    }  
    //printf("bind ok !\r\n");  
    /* 开始监听相应的端口 */  
    if(-1 == listen(sfp,5))  
    {  
        //printf("listen fail !\r\n");  
        return -1;  
    }  
   // printf("listen ok\r\n");  
      
    while(1)  
    {  
    sin_size = sizeof(struct sockaddr_in);  
    /* accept服务端使用函数，调用时即进入阻塞状态，等待用户进行连接，在没有客户端进行连接时，程序停止在此处， 
       不会看到后面的打印，当有客户端进行连接时，程序马上执行一次，然后再次循环到此处继续等待。 
       此处accept的第二个参数用于获取客户端的端口和地址信息。 
        */  
    nfp = accept(sfp, (struct sockaddr *)(&c_add), &sin_size);  
    //char const_hdr[] = "<?xml version=\"1.0\"?><!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\"><cross-domain-policy><allow-access-from domain=\"192.168.121.186\" to-ports=\"80\"/></cross-domain-policy>\0";
    
    getsockname(nfp, (struct sockaddr *)&addr, &sin_size);
    
    int length = 0;
    char ptr[50];
    char buf[500];  
    char const_hdr[500] = "<?xml version=\"1.0\"?><!DOCTYPE cross-domain-policy SYSTEM \"http://www.adobe.com/xml/dtds/cross-domain-policy.dtd\"><cross-domain-policy><site-control permitted-cross-domain-policies=\"master-only\"/>";
    char domain[100] = "<allow-access-from domain=\"";
    char port[100] = "\" to-ports=\"80-1024\"/></cross-domain-policy>";
    char flash_socket[] = "<policy-file-request/>";
  
    strcpy(ptr,inet_ntoa(addr.sin_addr));//printf("2 ! %s \r\n", inet_ntoa(addr.sin_addr));  
    strcat(const_hdr,domain);  
    strcat(const_hdr,ptr);
    strcat(const_hdr,port); 
    strcat(const_hdr,"\0"); 
    
    length = strlen(const_hdr);

    read(nfp, buf, 500);

    if(-1 == nfp)  
    {  
       // printf("accept fail !\r\n");  
        return -1;  
    }  
    //printf("accept ok!\r\nServer start get connect from %s : %#x\r\n",inet_ntoa(c_add.sin_addr),ntohs(c_add.sin_port));  
    //printf("buf : %s\n %d\n",buf,length);  
    /* 这里使用write向客户端发送信息，也可以尝试使用其他函数实现 */  
    if(-1 == write(nfp,const_hdr,length) && (strcmp(buf, flash_socket) == 0))  
    {  
        //printf("write fail!\r\n");  
        return -1;  
    }  
    write(nfp,NULL,1);
    //printf("write ok!\r\n");  
    close(nfp);  
      
    }  
    close(sfp);  
    return 0;  
    }  