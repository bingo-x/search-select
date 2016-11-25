var bibomGlobalData = [];
function bibomCreateOption(id, title, name, limit) {
    var curr_options = getGData(name + '_list');
    if(curr_options == null) {
        var new_options = [];
        $('#' + name + '-list').find('.' + name + '_id').each(function(){
            var _id = $(this).val();
            new_options[_id] = _id;
        });
        var g_data = [];
        g_data[name + '_list'] = new_options;
        setGData(g_data);
        var curr_options = getGData(name + '_list');
    }
    var exist = -1;
    var key;
    for(key in curr_options) {
        if(curr_options[key] == id) {
            exist = 1;
        }
    }
    var _html = '<div id="parent-' + name + '-list-' + id +'" class="bibom-search-cell ' + (exist != -1 ? 'active' : '') + '" onclick="bibomAddCell(this)" container-obj="' + name + '-list" name="' + name + '" val="' + id +'" title="' + title + '" limit="' + limit + '">' + title + '</div>';
    $('#bibom-search-content').append(_html);
}

function bibomCreateSelect(obj) {
    var $obj = $(obj);
    var _top = parseInt($obj.offset().top);
    var _left = parseInt($obj.offset().left);
    var _height = parseInt($obj.innerHeight());
    var _border_width = parseInt($obj.css("border-bottom")) * 2;
    var style = 'z-index: 19880408;position: absolute;left: ' + _left + 'px;top: ' + (_top + _height + _border_width) + 'px;';
    var _html = '';
    _html += '<div id="bibom-search-body" style="' + style + '">';
    _html += '<div class="bibom-search-content">';
    _html += '<div id="bibom-search-content"></div>';
    _html += '</div>';
    _html += '</div>';
    if($('#bibom-search-body').length == 1) {
        $('#bibom-search-body').remove();
    }
    $('body').append(_html);
    var e = event ? event : window;
    e.stopPropagation();
    $('#bibom-search-body').on('click', function() {
      var e = event ? event : window;
      e.stopPropagation();
    });
    $(document).bind('click.popcity', function() {
      bibomCloseSearch();
      $(document).unbind('click.popcity');
    });
}

function bibomLoading() {
    $('#bibom-search-content').html("<div class=\"bibom-search-loading\"><div class=\"bibom-loading-img\"></div></div>");
}

function bibomTips(msg) {
  $('#bibom-search-content').append('<div class="bibom-search-tips">' + msg + '</div>');
}

function bibomClearContent() {
    $('#bibom-search-content').html('');
}

function bibomCloseSearch() {
    $('#bibom-search-body').remove();
}

function bibomAddCell(obj) {
    var $obj = $(obj);
    var container_obj  = $obj.attr('container-obj');
    var val = $obj.attr('val');
    var name = $obj.attr('name');
    if($obj.hasClass('active')) {
        bibomRemoveCell(container_obj, val, name);
        return;
    }
    var curr_options = getGData(name + '_list');
    if(curr_options == null) {
        var curr_options = [];
    }
    var limit = $obj.attr('limit');
    if(limit != undefined && curr_options.length >= limit) {
        msg('超出了' + limit + '个限制！');
        return ;
    }
    $obj.addClass('active');
    var title = $obj.attr('title');
    var _cell = '<span class="bibom-cell" title="' + title + '">' + title + '<i id="' + container_obj + '-' + val + '" class="bibom-cell-i" onclick="bibomRemoveCell(\'' + container_obj + '\', \'' + val + '\', \'' + name + '\')"></i><input type="hidden" name="' + name + '_id[]" class="' + name + '_id" value="' + val + '"/><input type="hidden" name="' + name + '_name[]" class="' + name + '_name" value="' + title + '"/></span>';
    curr_options[val] = val;
    var g_data = [];
    g_data[name + '_list'] = curr_options;
    setGData(g_data);
    $('#' + container_obj).append(_cell);
    // 保存进缓存
    var old_data = getFromCache('bibom_plug_' + name);
    var new_data = [];
    new_data.push({id: val, name: title});
    if(old_data != null && old_data.length > 0) {
      var limit_num = 9;
      var i = 0;
      var key;
      for(key in old_data) {
        i++;
        if(i > limit_num) {
          break;
        }
        if(old_data[key].id != val) {
          new_data.push({id: old_data[key].id, name: old_data[key].name});
        }
      }
    }
    pushToCache('bibom_plug_' + name, new_data);
}

function bibomRemoveCell(container_obj, val, name) {
    $('#' + container_obj + '-' + val).parent().remove();;
    var $parent_obj = $('#parent-' + container_obj + '-' + val);
    if($parent_obj.hasClass('active')) {
        $parent_obj.removeClass('active');
    }
    var curr_options = getGData(name + '_list');
    if(curr_options != null) {
        var new_options = [];
        var key;
        for(key in curr_options) {
            if(curr_options[key] != val) {
                new_options[key] = curr_options[key];
            }
        }
        var g_data = [];
        g_data[name + '_list'] = new_options;
        setGData(g_data);
    }
}

function bibomSearch(obj, name, url, data, success) {
    bibomCreateSelect(obj);
    bibomLoading();
    var curr_time = new Date().getTime();
    setGData({search_start_time:curr_time});
    var index = _getCacheIndex(url, data);
    var data_cache = getGData(index);
    if(data_cache !== null) {
        success(data_cache);
    } else {
        setTimeout(function() {
            var start_time = getGData('search_start_time');
            var curr_time = new Date().getTime();
            if((curr_time - start_time) >= 230) {
                ajax("post", url, data, success, true, true);
            }
        }, 230);
    }
}

function bibomQueryHistory(obj, name, success) {
    bibomCreateSelect(obj);
    bibomLoading();
    var data = getFromCache('bibom_plug_' + name);
    success(data);
}
