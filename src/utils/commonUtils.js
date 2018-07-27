/**
 * Created by jiachenpan on 16/11/18.
 */

/* 时间格式转换*/
function formatDate(time, fmt) {
  if (time == null) {
    return "";
  }
  var date = new Date(time);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function toThousands(num) {
  let orgnum = num;
  num = num + "";
  let re = /\d{1,3}(?=(\d{3})+$)/g;
  let n1 = num.replace(/^[-+]?(\d+)((\.\d+)?)$/, function (s, s1, s2) {
    return s1.replace(re, "$&,") + s2;
  });

  var reg = new RegExp("^-?[0-9]*.?[0-9]*$");
  if (reg.test(orgnum)) {
    var absVal = Math.abs(orgnum);
    if (orgnum == absVal) {
      return n1;
    } else {
      return "-" + n1;
    }

  } else {
    return orgnum;
  }
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}


function objectCopy(source, target) {
  for (var p in source) { 
    if(source[p] != null){
      target[p] = source[p];
    }
  } 

  return target;
}


const commonUtils = {
  formatDate,
  objectCopy,
  toThousands
}

export default commonUtils
