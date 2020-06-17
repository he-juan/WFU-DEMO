/**
 *   JS的基本数据类型
 *   1、Undefined
 *   2、Null
 *   3、Boolean
 *   4、Number
 *   5、String
 */

/**
 *   typeof  使用   typeof value
 *   1、undefined
 *   2、boolean
 *   3、string
 *   4、number
 *   5、object
 *   6、function
 */

/**
 *   引用类型
 *    1、Object
 *    2、Array
 *    3、Date
 *    4、RegExp
 *    5、Function
 *    6、基本包装类型？  单体内置对象？
 */

/**
 *   Array.isarray();
 *   instanceof 使用  if (value instanceof Array)
 */

/**
 *   hasOwnProperty(propertyName)
 *   用于检测给定的属性在当前对象实例中(而不是在实例的原型中)是否存在
 *   o.hasOwnProperty('name')
 *
 *  Object.prototype.toString.call() // 用于判断数据类型
 */

/**
 *   for...in
 *   1、循环出的是key 包括原型上的属性
 *   2、只遍历可枚举属性
 *   Object.keys(obj)
 *   1、获取keys数组,不包括原型上的属性
 */

/**
 * 深拷贝有拷贝原型上的属性
 */

/**
 * url: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
 * Object.prototype.toString.call()
 */

const isObject = function (value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const isArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

const canClone = function (value) {
  return isObject(value) || isArray(value)
}

const cloneArray = function (value) {
  let array = []
  value.forEach((item, index) => {
    if (canClone(item)) {
      array[index] = deepClone(item)
    } else {
      array[index] = item
    }
  })
  return array
}

const cloneObject = function (value) {
  let obj = {}
  for (let item in value) {
    if (canClone(value[item])) {
      obj[item] = deepClone(value[item])
    } else {
      if (value.hasOwnProperty(item)) {
        obj[item] = value[item]
      }
    }
  }
  return obj
}

const deepClone = function (value) {
  if (!canClone(value)) {
    return value
  }
  if (isArray(value)) {
    return cloneArray(value)
  } else if (isObject(value)) {
    return cloneObject(value)
  }
}

export default deepClone
