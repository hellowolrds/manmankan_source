importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importClass(Packages.okhttp3.Request)
importClass(Packages.okhttp3.Headers)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)
importClass(Packages.com.reader.comic.utils.DecryptionUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "57漫画";
// 类型，相当于java中TYPE
var sort = 8;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "http://m.wuqimh.com/search/q_"+ keyword +"-p-" + page;
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("#data_list > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("a:eq(0)", 0);
        var title = node.text("a:eq(0) > h3");
        var cover = node.attr("a:eq(0) > div.thumb > img", "data-src");
        var update = node.text("dl:eq(4) > dd");
        var author = node.text("dl:eq(1) > a > dd");

        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "http://m.wuqimh.com/".concat(cid);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("div.main-bar > h1");
    var cover = body.src("div.book-detail > div.cont-list > div.thumb > img");
    var update = body.text("div.book-detail > div.cont-list > dl:eq(7) > dd");
    var intro = body.text("#bookIntro");
    var author = body.text("div.book-detail > div.cont-list > dl:eq(3) > dd");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);

    var chapterList = body.list("#chapterList > ul > li > a");
    var list = new ArrayList();

    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit(1);
        list.add(new Chapter(title, path));
    }

    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
   var url = StringUtils.format("http://m.wuqimh.com/%s/%s.html", cid, path);
   return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.wuqimh.com/");
}
function getHeader2 (url) {
    return getHeader();
}
function getHeader3 () {
    return getHeader();
}

// 解析图片
function parseImages() {
   var list = new ArrayList();

   var packed = StringUtils.match("eval(.*?)\\n", content, 1);
   if (packed != null) {
      var result = DecryptionUtils.evalDecrypt(packed);
      var jsonString = StringUtils.match("'fs':\\s*(\\[.*?\\])", result, 1);
      var array = new JSONArray(jsonString);
      var size = array.length();
      for (var i = 0; i != size; ++i) {
          var url = array.getString(i);
          if(url.indexOf("http://") == -1){
              url = "http://images.lancaier.com" + url;
          }
          list.add(new ImageUrl(i + 1, url, false));
      }
   }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("热血", "1"));
    list.add(Pair.create("武侠", "2"));
    list.add(Pair.create("搞笑", "3"));
    list.add(Pair.create("耽美", "4"));
    list.add(Pair.create("爱情", "5"));
    list.add(Pair.create("科幻", "6"));
    list.add(Pair.create("魔法", "7"));
    list.add(Pair.create("神魔", "8"));
    list.add(Pair.create("竞技", "9"));
    list.add(Pair.create("格斗", "10"));
    list.add(Pair.create("机战", "11"));
    list.add(Pair.create("体育", "12"));
    list.add(Pair.create("运动", "13"));
    list.add(Pair.create("校园", "14"));
    list.add(Pair.create("励志", "15"));
    list.add(Pair.create("历史", "16"));
    list.add(Pair.create("伪娘", "17"));
    list.add(Pair.create("百合", "18"));
    list.add(Pair.create("后宫", "19"));
    list.add(Pair.create("治愈", "20"));
    list.add(Pair.create("美食", "21"));
    list.add(Pair.create("推理", "22"));
    list.add(Pair.create("悬疑", "23"));
    list.add(Pair.create("恐怖", "24"));
    list.add(Pair.create("职场", "25"));
    list.add(Pair.create("BL", "26"));
    list.add(Pair.create("剧情", "27"));
    list.add(Pair.create("生活", "28"));
    list.add(Pair.create("幻想", "29"));
    list.add(Pair.create("战争", "30"));
    list.add(Pair.create("仙侠", "33"));
    list.add(Pair.create("性转换", "40"));
    list.add(Pair.create("冒险", "41"));
    list.add(Pair.create("其他", "32"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url =  "http://www.wuqimh.com/list/smid-"+format+"-p-"+page;
   return new Request.Builder()
       .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list("#contList > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("a", 0);
        var title = node.text(".ell");
        var cover = node.attr(".bcover > img", "data-src");
        var update = node.text(".tt");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}