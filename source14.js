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
importClass(Packages.java.net.URLEncoder)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "古风漫画";
// 类型，相当于java中TYPE
var sort = 14;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        url = StringUtils.format("https://m.gufengmh8.com/search/?keywords=%s",
            URLEncoder.encode(keyword, "UTF-8"));
    }
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("div.UpdateList > div.itemBox");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("div.itemTxt > a", "href").replace("https://m.gufengmh8.com/manhua/", "");
        cid = cid.substring(0, cid.length() - 1);
        var title = node.text("div.itemTxt > a");
        var cover = node.attr("div.itemImg > a > mip-img", "src");
        var update = node.text("div.itemTxt > p:eq(3) > span.date");
        var author = node.text("div.itemTxt > p:eq(1)");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://m.gufengmh8.com/manhua/".concat(cid) + "/";
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("h1.title");
    var cover = body.src("#Cover > mip-img");
    var update = body.text("div.pic > dl:eq(4) > dd");
    var intro = body.text("div.comic-view.clearfix > p");
    var author = body.text("div.pic > dl:eq(2) > dd");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("ul[id^=chapter-list] > li > a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit(2);
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
      var url = StringUtils.format("https://m.gufengmh8.com/manhua/%s/%s.html", cid, path);
      return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36");
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
    var str = StringUtils.match("chapterImages = \\[(.*?)\\]", content, 1);
    var array = str.split(",");
    var urlPrev = StringUtils.match("chapterPath = \"(.*?)\"", content, 1);
    for (var i = 0; i < array.length; i++) {
      // 去掉首末两端的双引号
      var s = array[i].substring(1, array[i].length() - 1);
      // http://res.gufengmh8.com/images/comic/159/316518/1519527843Efo9qfJOY9Jb_VP4.jpg
      list.add(new ImageUrl(i + 1, "https://res.gufengmh8.com/" + urlPrev + s, false));
    }
    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("日本漫画", "/list/ribenmanhua/"));
   list.add(Pair.create("少年漫画", "/list/shaonian/"));
   list.add(Pair.create("少女漫画", "/list/shaonv/"));
   list.add(Pair.create("青年漫画", "/list/qingnian/"));
   list.add(Pair.create("真人漫画", "/list/zhenrenmanhua/"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://m.gufengmh8.com"+format+page+"/";
   Log.d("骑牛", url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list("#w0 .col_3_1 > .list-comic");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr(".ImgA", "href").replace("https://m.gufengmh8.com/manhua/", "");
        cid = cid.substring(0, cid.length() - 1);
        var title = node.text(".txtA");
        var cover = node.attr(".ImgA mip-img", "src");
        Log.d("图片地址", cover);
        var update = node.text(".info");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}