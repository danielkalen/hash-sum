'use strict';

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
  var type = typeof value,
      hash = type === 'string' ? 5361 : fold(fold(input,key), toString(value));

  if (hash === 5361) {
    return fold(hash, value);
  }
  if (value === null) {
    return fold(hash, 'null');
  }
  if (value === undefined) {
    return fold(hash, 'undefined');
  }
  if (typeof value === 'object') {
    if (seen) {
      if (seen.indexOf(value) !== -1) {
        return fold(hash, '[Circular]' + key);
      }
      seen.push(value);
    }
    return foldObject(hash, value, seen);
  }
  return fold(hash, ''+value);
}

function toString (o) {
  return Object.prototype.toString.call(o);
}

function sum (o, avoidCircular) {
  return ''+foldValue(0, o, '', avoidCircular && []);
}

module.exports = sum;
