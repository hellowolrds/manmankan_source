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
importClass(Packages.okhttp3.RequestBody)
importClass(Packages.okhttp3.OkHttpClient)



// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "六漫画";
// 类型, 类型必须是唯一的，不然会导入失败
var sort = 32;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
      url = "http://m.6mh7.com/search?keyword="+keyword;
    }
    return new Request.Builder()
        .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".result-list > a");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(0);
        var title = node.text(".cartoon-info h2");
        var cover = node.attr("img", "src");
        var update = node.text("span");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}
// 详情请求头
function getInfoRequest(cid) {
    Log.d("详情", cid)
    var url = "http://m.6mh7.com/"+cid+"/";
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
}
// 解析详情
function parseInfo() {
    //    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("h1.cartoon-title");
    var cover = body.src(".cartoon-poster");
    var update = body.text("#js_read_catalog .update-time");
    var author = body.text(".author");
    var intro = body.text(".introduction");
    var status = false;

    var comic = new Comic(sort, "");

    comic.setInfo(title, cover, update, intro, author, status);

    return comic;
}


// 解析章节
function parseChapter () {
    var body = new Node(content);
    var conList = body.list("#chapter-list1 a");
    var list = new ArrayList();

    for (var i = 0; i < conList.size(); i ++) {
        var node = conList.get(i);
        var title = node.text();
        var path = node.href();
        list.add(new Chapter(title, path));
    }

    var cid = body.hrefWithSplit("#chapter-list1 a:first-child", 0);
    var client = new OkHttpClient();
    var body = new FormBody.Builder()
        .add("id", cid)
        .add("id2", "1").build();
    var request = new Request.Builder()
      .url("http://m.6mh7.com/bookchapter/")
      .post(body)
      .build();//创建Request 对象
    var response = client.newCall(request).execute();
    if (response.isSuccessful()) {
       var chapterList = new JSONArray(response.body().string());
       for (var i = 0; i <chapterList.length(); i ++) {
           var json = chapterList.getJSONObject(i);
           var title = json.getString("chaptername");
           var path = "/"+ cid + "/"+ json.getString("chapterid") +".html";
           list.add(new Chapter(title, path));
        }
//       Log.d("测试", response.body().string());
    }

    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://m.6mh7.com" + path;
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://m.dmzj.com/");
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

    var reg = /\}\('(.+\])',([0-9]*),([0-9]*),('.+'\)),([0-9]*),(\{.*\})/g;
    var params = reg.exec(content);
    eval(get_img(params[1], params[2], params[3], params[4], 0, {}));
//    Log.d("测试", newImgs);



    for (var i = 0; i < newImgs.length; i ++) {
        var url = newImgs[i];
        list.add(new ImageUrl(i+1, url, false));
    }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create(" 冒险热血 ", "1"));
    list.add(Pair.create(" 武侠格斗 ", "2"));
    list.add(Pair.create(" 科幻魔幻 ", "3"));
    list.add(Pair.create(" 侦探推理 ", "4"));
    list.add(Pair.create(" 耽美爱情 ", "5"));
    list.add(Pair.create(" 生活漫画 ", "6"));
    list.add(Pair.create(" 推荐漫画 ", "11"));
    list.add(Pair.create(" 完结 ", "12"));
    list.add(Pair.create(" 连载中 ", "13"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var body = new FormBody.Builder()
            .add("type", format)
            .add("page_num", page+"").build();
    return new Request.Builder().post(body).url("http://m.6mh7.com/sortdata.php").build();
}

//解析推荐
function parseCategory() {
    eval("var data1 = "+content+";");
    var list = new ArrayList();
    for (var i = 0; i <data1.length; i ++) {
        var json = data1[i];
        var cid = json.id;
        var title = json.name;
//        Log.d("标题", title);
        var cover = json.imgurl;
        var update = json.remarks;
        var author = json.author;

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