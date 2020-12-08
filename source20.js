importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importPackage(Packages.okhttp3)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)
importClass(Packages.java.net.URLEncoder)
importPackage(Packages.java.util.regex)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "布卡漫画";
// 类型，相当于java中TYPE
var sort = 20;

// 请求头
function getSearchRequest (keyword, page) {
     var url = "http://m.buka.cn/search/ajax_search";
     var data = new FormBody.Builder()
             .add("key", keyword)
             .add("start", String.valueOf(15 * (page - 1)))
             .add("count", "15")
             .build();//key=%E4%B8%8D%E5%AE%9C%E5%AB%81&start=0&count=15
     return new Request.Builder()
             .url(url)
             .post(data)
             .build();
}

// 解析搜索页面
function getSearchIterator() {
    var jsonObject = new JSONObject(content);
    var dataObject = jsonObject.getJSONObject("datas");
    var chapterList = dataObject.getJSONArray("items");
    var list = new ArrayList();
    for (var i = 0; i <chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("mid");
        var title = json.getString("name");
        var cover = json.getString("logo");
        var update = null;
        var author = json.getString("author");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "http://m.buka.cn/m/".concat(cid);
    return new Request.Builder()
        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 7.0;) Chrome/58.0.3029.110 Mobile")
        .url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("p.mangadir-glass-name");
    var cover = body.src(".mangadir-glass-img > img");
    var update = body.text("span.top-title-right");
    var intro = body.text("span.description_intro");
    var author = body.text(".mangadir-glass-author");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("div.chapter-center > a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.href().split("/")[3];
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
     var url = StringUtils.format("http://m.buka.cn/read/%s/%s", cid, path);
     return new Request.Builder()
        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 7.0;) Chrome/58.0.3029.110 Mobile")
        .url(url)
        .build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.buka.cn");
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
    var m = Pattern.compile("<img class=\"lazy\" data-original=\"(http.*?jpg)\" />").matcher(content);
    if (m.find()) {
       var i = 0;
       do {
           list.add(new ImageUrl(++i, StringUtils.match("http.*jpg", m.group(0), 0), false));
       } while (m.find());
    }
    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("今日热榜", "今日热榜_10018"));
   list.add(Pair.create("已完结", "已完结_12022"));
   list.add(Pair.create("高分精选", "高分精选_12064"));
   list.add(Pair.create("最近上新", "最近上新_12084"));
   list.add(Pair.create("日韩", "日韩_12053"));
   list.add(Pair.create("经典", "经典_303"));
   list.add(Pair.create("联合出品", "联合出品_12033"));
   list.add(Pair.create("条漫", "条漫_036"));
   list.add(Pair.create("玄幻", "玄幻_12041"));
   list.add(Pair.create("都市恋爱", "都市恋爱_12116"));
   list.add(Pair.create("恋爱", "恋爱_404"));
   list.add(Pair.create("游戏", "游戏_12018"));
   list.add(Pair.create("治愈", "治愈_202"));
   list.add(Pair.create("科幻", "科幻_403"));
   list.add(Pair.create("搞笑", "搞笑_10008"));
   list.add(Pair.create("架空", "架空_211"));
   list.add(Pair.create("励志", "励志_12023"));
   list.add(Pair.create("格斗", "格斗_410"));
   list.add(Pair.create("少女漫", "少女漫_12103"));
   list.add(Pair.create("少年漫", "少年漫_12104"));
   list.add(Pair.create("真人漫", "真人漫_12117"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = "http://m.buka.cn/category/ajax_group";
    var params = format.split("_");
    var data = new FormBody.Builder()
           .add("fun", "1")
           .add("param", params[1])
           .add("gname", params[0])
           .add("start", String.valueOf(15 * (page - 1)))
           .add("count", "15")
           .build();//key=%E4%B8%8D%E5%AE%9C%E5%AB%81&start=0&count=15
    return new Request.Builder()
           .url(url)
           .post(data)
           .build();
}

//解析推荐
function parseCategory() {
    var temp = new JSONObject(content);
    var dataObject = temp.getJSONObject("datas");
    var dataArray = dataObject.getJSONArray("items");
    var list = new ArrayList();

    for (var i = 0; i < dataArray.length(); i ++) {
        var object1 = dataArray.getJSONObject(i);
        var cid = object1.getString("mid");
        var title = object1.getString("name");
        var cover = object1.getString("logo");
        var author = object1.getString("author");
        list.add(new Comic(sort, cid, title, cover, "", author));
    }

    return list;
}