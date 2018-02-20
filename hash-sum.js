'use strict';
var EMPTY_STRING_HASH = 5361,
    EMPTY_STRING = '',
    CIRCULAR = '[Circular]',
    OBJECT_TYPE = 'object',
    STRING_TYPE = 'string',
    objectToString = Object.prototype.toString;


function fold (hash, text) {
  var chr, len = text.length, i = -1;
  if (text.length === 0) {
    return hash;
  }

  while (++i !== len) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  return hash < 0 ? hash * -2 : hash;
}

function sort (arr) {
  if (arr.length < 2) {
    return arr;
  } else {
    var pivot = arr[0], less = [], great = [], len = arr.length, i = 0;

    while (++i !== len) {
      if (arr[i] <= pivot) {
        less.push(arr[i]);
      } else {
        great.push(arr[i]);
      }
    }
    return sort(less).concat(pivot, sort(great));
  }
}


function foldObject (hash, o, seen) {
  var keys = sort(Object.keys(o)), len = keys.length, i = -1;
  
  while (++i !== len) {
    hash = hash+foldValue(hash, o[keys[i]], keys[i], seen);
  }
  return hash;
}

function foldValue (input, value, key, seen) {
  var hash = typeof value === STRING_TYPE ? EMPTY_STRING_HASH : fold(fold(input,key), objectToString.call(value));

  if (hash === EMPTY_STRING_HASH) {
    return fold(hash, value);
  }
  if (value === undefined || value === null) {
    return fold(hash, EMPTY_STRING+value);
  }
  if (typeof value === OBJECT_TYPE) {
    if (seen) {
      if (seen.indexOf(value) !== -1) {
        return fold(hash, CIRCULAR+key);
      }
      seen.push(value);
    }
    return foldObject(hash, value, seen);
  }
  return fold(hash, EMPTY_STRING+value);
}

function sum (o, avoidCircular) {
  return EMPTY_STRING+foldValue(0, o, EMPTY_STRING, avoidCircular && []);
}

module.exports = sum;
