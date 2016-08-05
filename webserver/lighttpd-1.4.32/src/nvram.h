/*
 * NVRAM variable manipulation
 *
 * Copyright 2005, Broadcom Corporation
 * All Rights Reserved.
 * 
 * THIS SOFTWARE IS OFFERED "AS IS", AND BROADCOM GRANTS NO WARRANTIES OF ANY
 * KIND, EXPRESS OR IMPLIED, BY STATUTE, COMMUNICATION OR OTHERWISE. BROADCOM
 * SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A SPECIFIC PURPOSE OR NONINFRINGEMENT CONCERNING THIS SOFTWARE.
 *
 * $Id: nvram.h,v 1.3 2012-04-25 10:50:56 xhhuang Exp $
 *
 * SCF - ADM5120 port - 6/30/2006
 *     - removed broadcom specific portions and OS indepent layer
 *     - removed MTD dependence, ported to raw flash access routines
 *     - added zlib support and checksumming for nvram file
 *                     
 */

#ifndef _bcmnvram_h_
#define _bcmnvram_h_

#define NVRAM_DEV_MAJOR 241
#define NVRAM_DEV_MINOR 0

#ifndef _LANGUAGE_ASSEMBLY

#include <string.h>
#include <linux/types.h>

struct nvram_header {
	int magic;
	int len;
};

struct nvram_tuple {
	char *name;
	char *value;
	struct nvram_tuple *next;
};

/*
 * we don't know how much data we'll get out of the compressed data stored in flash,
 * so we'll create a linked list element for each call to zlib_inflate with 
 * the number of bytes available in the decompression buffer equal to the size of the
 * array pointed to by *data, then glue all the array elements together for processing
 */
struct nvram_inflate_stream {
	char *data;
	struct nvram_inflate_stream *next;
};

#ifdef __cplusplus
extern "C" {
#endif

/*
 * Initialize NVRAM access. May be unnecessary or undefined on certain
 * platforms.
 */
extern int nvram_init(void*);

/*
 * Disable NVRAM access. May be unnecessary or undefined on certain
 * platforms.
 */
extern void nvram_exit(void);

/*
 * Get the value of an NVRAM variable. The pointer returned may be
 * invalid after a set.
 * @param	name	name of variable to get
 * @return	value of variable or NULL if undefined
 */
extern char * nvram_get(const char *name);

/* 
 * Get the value of an NVRAM variable.
 * @param	name	name of variable to get
 * @return	value of variable or NUL if undefined
 */
#define nvram_safe_get(name) (nvram_get(name) ? : "")

/*
 * Match an NVRAM variable.
 * @param	name	name of variable to match
 * @param	match	value to compare against value of variable
 * @return	TRUE if variable is defined and its value is string equal
 *		to match or FALSE otherwise
 */
static __inline__ int
nvram_match(char *name, char *match) {
	const char *value = nvram_get(name);
	return (value && !strcmp(value, match));
}

/*
 * Inversely match an NVRAM variable.
 * @param	name	name of variable to match
 * @param	match	value to compare against value of variable
 * @return	TRUE if variable is defined and its value is not string
 *		equal to invmatch or FALSE otherwise
 */
static __inline__ int
nvram_invmatch(char *name, char *invmatch) {
	const char *value = nvram_get(name);
	return (value && strcmp(value, invmatch));
}

/*
 * Set the value of an NVRAM variable. The name and value strings are
 * copied into private storage. Pointers to previously set values
 * may become invalid. The new value may be immediately
 * retrieved but will not be permanently stored until a commit.
 * @param	name	name of variable to set
 * @param	value	value of variable
 * @return	0 on success and errno on failure
 */
extern int nvram_set(const char *name, const char *value);

/*
 * Unset an NVRAM variable. Pointers to previously set values
 * remain valid until a set.
 * @param	name	name of variable to unset
 * @return	0 on success and errno on failure
 * NOTE: use nvram_commit to commit this change to flash.
 */
extern int nvram_unset(const char *name);

/*
 * Erase all NVRAM variables
 * @return	0 on success and errno on failure
 */
extern int nvram_erase_all(void);

/*
 * Commit NVRAM variables to permanent storage. All pointers to values
 * may be invalid after a commit.
 * NVRAM values are undefined after a commit.
 * @return	0 on success and errno on failure
 */
extern int nvram_commit(void);

/*
 * Get all NVRAM variables (format name=value\0 ... \0\0).
 * @param	buf	buffer to store variables
 * @param	count	size of buffer in bytes
 * @return	0 on success and errno on failure
 */
extern int nvram_getall(char *buf, int count);

#ifdef __cplusplus
}
#endif

#endif /* _LANGUAGE_ASSEMBLY */

#define NVRAM_MAGIC		0x48534C46	/* 'FLSH' */
#define NVRAM_VERSION		1
#define NVRAM_HEADER_SIZE	20
#define NVRAM_SPACE		0x4000

#endif /* _bcmnvram_h_ */
