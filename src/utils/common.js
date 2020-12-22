/**
 * @desc 封装了一些项目常用方法.
 */
import { CLS_PREFIX } from 'Constants/common';

// 内部函数, 用于判断对象类型
function _getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

export function isArray(obj) {
    return _getClass(obj).toLowerCase() === 'array';
}

export function isString(obj) {
    return _getClass(obj).toLowerCase() === 'string';
}

export function isDate(obj) {
    return _getClass(obj).toLowerCase() === 'date';
}

export function isObject(obj) {
    return _getClass(obj).toLowerCase() === 'object';
}

export function isNumber(obj) {
    return _getClass(obj).toLowerCase() === 'number';
}

export function isFormData(obj) {
    try {
        if (obj instanceof FormData) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

export function isIE() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('compatible') > -1 &&
        userAgent.indexOf('MSIE') > -1) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否为空, 包括null, undefined, [], '', {}
 * @param {object} obj 需判断的对象
 */
export function isEmpty(obj) {
    var empty = false;

    if (obj === null || obj === undefined) { // null and undefined
        empty = true;
    } else if ((isArray(obj) || isString(obj)) && obj.length === 0) {
        empty = true;
    } else if (isObject(obj)) {
        var hasProp = false;
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                hasProp = true;
                break;
            }
        }
        if (!hasProp) {
            empty = true;
        }
    } else if (isNumber(obj) && isNaN(obj)) {
        empty = true;
    }
    return empty;
}

/**
 * @desc 判断参数是否不为空
 */
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

/**
 * @desc 判断参数是否为空字符串, 比isEmpty()多判断字符串中全是空格的情况, 如: '   '.
 * @param {string} str 需判断的字符串
 */
export function isBlank(str) {
    if (isEmpty(str)) {
        return true;
    } else if (isString(str) && str.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否不为空字符串
 */
export function isNotBlank(obj) {
    return !isBlank(obj);
}

/**
 * @desc 函数节流
 * @url http://underscorejs.org/#throttle
 * @param {string} func 防抖函数
 * @param {string} wait 间隔时间
 * @param {string} options 可选项
 */
export function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) {
        options = {};
    }

    var later = function() {
        previous = options.leading === false ? 0 : +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };

    return function() {
        var now = +new Date();
        if (!previous && options.leading === false) {
            previous = now;
        } 
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
/**
 * @desc 字符串切分为数组
 * @param {String} str 将要切分的字符串
 * @param {String} separator 分隔符
 * @return {Array} 切分的数组.
 */
export function spliteStr(str, separator = ',') {
    if (isBlank(str)) {
        return [];
    }

    var array = [];

    str.split(separator).forEach(substring => {
        var substr = substring.trim();
        if (substr.length > 0) {
            array.push(substr);
        }
    });
    return array;
}
/**
 * @desc 事件代理函数
 * @param {Element} elem 绑定事件的代理元素
 * @param {String} type 触发的事件
 * @param {String} selector 元素选择器, 触发事件的元素
 * @param {Function} fn 事件回调方法.
 * @param {Object} data 传递的参数.
 */
export function delegate(elem, type, selector, fn, data = {}) {
    if (!elem || !type) {
        return;
    }

    function handler(event) {
        var target = event.target;
        var _target = [].find.call(elem.querySelectorAll(selector), (el) => {
            // 确保是在 selector 内的事件源触发
            return el === target || el.contains(target);
        });

        if (_target) {
            // 创建一个事件代理对象.
            var eventProxy = {
                target: event.target,
                currentTarget: _target,
                originalEvent: event,
                relatedTarget: event.relatedTarget,
                type: event.type,
                data,
                preventDefault() {
                    this.originalEvent.preventDefault();
                },
                stopPropagation() {
                    this.originalEvent.stopPropagation();
                },
                stopImmediatePropagation() {
                    this.originalEvent.stopImmediatePropagation();
                    this.stopPropagation();
                }
            };

            var ret = fn.call(_target, eventProxy);
            // 如果方法返回 false 表示阻止浏览器默认行为和事件冒泡, like jQuery.
            if (ret !== undefined) {
                if (ret === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }

    if (elem.addEventListener) {
        elem.addEventListener(type, handler);
    }
}

export function getClassPrefix(className, prefix = CLS_PREFIX) {
    if (className) {
        return `${prefix}-${className}`; 
    }

    return prefix;
}