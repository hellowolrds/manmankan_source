// 导入需要依赖的类
importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
// 导入依赖包
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)
importClass(Packages.com.reader.comic.utils.StringUtils)

importClass(Packages.okhttp3.FormBody)
importClass(Packages.okhttp3.Headers)
importClass(Packages.okhttp3.Request)



// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "漫画BZ";
// 类型, 类型必须是唯一的，不然会导入失败
var sort = 33;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
      url = "http://www.mangabz.com/search?title="+keyword;
    }
    return new Request.Builder()
        .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".manga-list > a");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(0);
        var title = node.text(".manga-item-title");
        var cover = node.attr(".manga-item-cover", "src");
        Log.d("测试", cover);
        var update = node.text(".manga-item-subtitle");
        update = update.replace("作者：", "");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}
// 详情请求头
function getInfoRequest(cid) {
    var url = "http://www.mangabz.com/"+cid+"/";
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
}
// 解析详情
function parseInfo() {
    //    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".detail-main-title");
    var cover = body.src(".detail-bar-img");
    var update = "";
    var author = body.text(".detail-main-subtitle span:last-child");
    var intro = body.text(".detail-main-content");
    var status = false;

    var comic = new Comic(sort, "");

    comic.setInfo(title, cover, update, intro, author, status);

    return comic;
}


// 解析章节
function parseChapter () {
    var body = new Node(content);
    var conList = body.list(".detail-list .detail-list-item");
    var list = new ArrayList();

    for (var i = 0; i < conList.size(); i ++) {
        var node = conList.get(i);
        var title = node.text();
        var path = node.href("a");
        list.add(new Chapter(title, path));
    }



    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://www.mangabz.com" + path;
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1");
}
function getHeader2(url) {
    return getHeader();
}
function getHeader3 () {
    return getHeader ();
}

// 解析图片
function parseImages() {
    var list = new ArrayList();
//    Log.d("网页内容", content);
    var reg = /\}\('(.+\];)',([0-9]*),([0-9]*),('.+'\)),([0-9]*),(\{.*\})/g;
    var params = reg.exec(content);
    params[1] = params[1].replace(/\\/g, "");
    eval(get_img(params[1], params[2], params[3], params[4], 0, {}));

    for (var i = 0; i < newImgs.length; i ++) {
        var url = newImgs[i];
        list.add(new ImageUrl(i+1, url, false));
    }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "0"));
    list.add(Pair.create("熱血", "31"));
    list.add(Pair.create("戀愛", "26"));
    list.add(Pair.create("校園", "1"));
    list.add(Pair.create("冒險", "2"));
    list.add(Pair.create("科幻", "25"));
    list.add(Pair.create("生活", "11"));
    list.add(Pair.create("懸疑", "17"));
    list.add(Pair.create("魔法", "15"));
    list.add(Pair.create("運動", "34"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = "http://www.mangabz.com/";
    if (format == '0') {
        url = url + "manga-list/mangabz.ashx";
    }
    else {
        url = url + "manga-list-"+ format +"-0-10/mangabz.ashx";
    }

    var body = new FormBody.Builder()
            .add("action", "getclasscomics")
            .add("pageindex", page+"")
            .add("pagesize", "21")
            .add("tagid", format)
            .add("status", "0")
            .add("sort", "10").build();
    return new Request.Builder().post(body).url(url).build();
}

//解析推荐
function parseCategory() {
    eval("var data1 = "+content+";");
    var list = new ArrayList();
    var arr = data1.UpdateComicItems;
    for (var i = 0; i <arr.length; i ++) {
        var json = arr[i];
        var cid = json.UrlKey;
        var title = json.Title;
//        Log.d("标题", title);
        var cover = json.ShowConver;
        var update = json.LastUpdateTime;
        var author = json.Author.join(",");

        list.add(new Comic(sort, cid, title, cover, null, author));
    }
    return list;
}



function get_img (p, a, c, k, e, d) {
  eval("k="+k+";")
  e = function(c) {
      return (c < a ? '': e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
  };
  if (!''.replace(/^/, String)) {
      while (c--) {
          d[e(c)] = k[c] || e(c)
      }
      k = [function(e) {
          return d[e]
      }];
      e = function() {
          return '\\w+'
      };
      c = 1
  };
  while (c--) {
      if (k[c]) {
          p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
      }
  }
  return p
}