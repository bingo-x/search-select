var globalData = [];
function setGData(arr) {
    var key;
    for(key in arr) {
        globalData[key] = arr[key];
    }
}

function getGData(key) {
    if(globalData[key] === undefined) {
        return null;
    }
    return globalData[key];
}

function deleteGData(key) {
    if(globalData[key] !== undefined) {
        delete globalData[key];
    }
}

function pushToCache(key, obj) {
  if(key == '' || key == undefined) {
    return false;
  }
  if(typeof(obj) === 'object') {
    var obj_json = JSON.stringify(obj);
    localStorage.setItem(key, obj_json);
  }
  return false;
}

function getFromCache(key) {
  if(key == '' || key == undefined) {
    return null;
  }
  var result = localStorage.getItem(key);
  if(result != '' && result != undefined) {
    var data = $.parseJSON(result);
    return data;
  }
  return null;
}

function deleteCache(key) {
  if(key == '' || key == undefined) {
    return false;
  }
  localStorage.removeItem(key);
  return true;
}

/*
 * 简单的ajax请求
 * */
function ajax(type, url, data, successCallback, isUseCache, isCloseLoading) {
  if(isCloseLoading == undefined || isCloseLoading == false) {
    // 加载蒙版
  }
  function _success(result) {
    if(isUseCache === true) {
      var index = _getCacheIndex(url, data);
      var g_data = [];
      g_data[index] = result;
      setGData(g_data);
    }
    if (typeof successCallback == 'function') {
      successCallback(result);
    } else {
      if (result.code == 'N00000') {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    }
  }
  function _comlete() {
    if(isCloseLoading == undefined || isCloseLoading == false) {
      // 关闭加载蒙版
    }
  }
  if(isUseCache === true) {
    var index = _getCacheIndex(url, data);
    var data_cache = getGData(index);
    if(data_cache !== null) {
      _success(data_cache);
      _comlete();
      return;
    }
  }
  $.ajax({
    type: type,
    url: url,
    data: data,
    dataType: "json",
    success: _success,
    complete: _comlete,
    error: function(){
      console.log('访问服务失败，请稍后再尝试！');
    }
  });
}
function _getCacheIndex(url, data) {
  var index = '';
  var str_data = '';
  if(data) {
    var key;
    for(key in data) {
      str_data += '&' + key + '=' + data[key];
    }
  }
  index = md5(url + str_data);
  return index;
}
