#ifndef TIMEZONE_OFFSET_H
#define TIMEZONE_OFFSET_H

#ifdef _cplusplus
extern "C"
{
#endif
void get_timezone_offset(const char *id[], const int n, long *result);
#ifdef _cplusplus
}
#endif

#endif // _TIMEZONE_OFFSET
