var formatTime = (nDate, date) => {
  if (isNaN(nDate.getTime())) {
    // 不是时间格式
    return '--'
  }
  let o = {
    'M+': nDate.getMonth() + 1,
    'd+': nDate.getDate(),
    'h+': nDate.getHours(),
    'm+': nDate.getMinutes(),
    's+': nDate.getSeconds(),
    // 季度
    'q+': Math.floor((nDate.getMonth() + 3) / 3),
    'S': nDate.getMilliseconds()
  }
  if (/(y+)/.test(date)) {
    date = date.replace(RegExp.$1, (nDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(date)) {
      date = date.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return date
}

var formatDate = function(date) {
  var year = date.getFullYear() + '';
  var month = date.getMonth() + 1 + '';
  var day = date.getDate() + '';
  month.length === 1 && (month = 0 + month);
  day.length === 1 && (day = 0 + day);
  return `${year}-${month}-${day}`
}

function observer(ctx, obj, key, fn) {
  var val = obj[key];
  fn(val);
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      return val;
    },
    set(newVal) {
      Promise.resolve().then(() => fn.call(ctx, newVal));
      val = newVal;
    }
  });
};

function watch(ctx, obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(ctx.data, key, ctx.data[key], function(value) {
      obj[key].call(ctx, value)
    })
  })
}

function computed(ctx, obj) {
  let keys = Object.keys(obj)
  let dataKeys = Object.keys(ctx.data)
  dataKeys.forEach(dataKey => {
    defineReactive(ctx.data, dataKey, ctx.data[dataKey])
  })
  let firstComputedObj = keys.reduce((prev, next) => {
    ctx.data.$target = function() {
      ctx.setData({ [next]: obj[next].call(ctx) })
    }
    prev[next] = obj[next].call(ctx)
    ctx.data.$target = null
    return prev
  }, {})
  ctx.setData(firstComputedObj)
}

function defineReactive(data, key, val, fn) {
  let subs = data['$' + key] || []
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function() {
      if (data.$target) {
        subs.push(data.$target)
        data['$' + key] = subs
      }
      return val
    },
    set: function(newVal) {
      if (newVal === val) return
      fn && fn(newVal)
      if (subs.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
        setTimeout(() => {
          subs.forEach(sub => sub())
        }, 0)
      }
      val = newVal
    },
  })
}

module.exports = {
  formatTime,
  formatDate,
  computed,
  watch,
  observer
}
