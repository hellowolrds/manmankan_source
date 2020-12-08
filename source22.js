importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importClass(Packages.okhttp3.Request)
importClass(Packages.okhttp3.Headers)
importClass(Packages.okhttp3.FormBody)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)
importClass(Packages.java.net.URLEncoder)
importClass(Packages.com.reader.comic.utils.DecryptionUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "米推漫画";
// 类型，相当于java中TYPE
var sort = 22;

// 请求头
function getSearchRequest (keyword, page) {
    var url = StringUtils.format("https://m.imitui.com/search/?keywords=%s&page=%s", keyword, page+"");
    Log.d("请求地址", "getSearchRequest: "+url);
    return new Request.Builder()
            .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
            .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("div.UpdateList > div.itemBox");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var title = node.text("div.itemTxt > a");
        var cover = node.attr("div.itemImg > a > img", "src");
        var cid = node.attr("div.itemTxt > a", "href").replace("https://m.imitui.com/manhua/", "");
        cid = cid.substring(0, cid.length() - 1);
        var update = node.text("div.itemTxt > p:eq(3) > span.date");
        var author = node.text("div.itemTxt > p:eq(1)");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = "https://m.imitui.com/manhua/".concat(cid) + "/";
   return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("#comicName");
    var cover =  body.src("#Cover img");
    var update = body.text(".date");
    var intro = body.text("#simple-des");
    var author = body.text(".txtItme:first-child");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#chapter-list-1 li");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.attr("a", "href");
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    path = path.replace("//m", "//www");
    return new Request.Builder().url(path).build();
}

function getHeader () {
    return Headers.of("Referer", "http://www.cartoonmad.com");
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
    var base_url = "https://res0818.imitui.com";
    if (str != null) {
       var array = str.split(",");
       var urlPrev = StringUtils.match("chapterPath = \"(.*?)\"", content, 1);
       for (var i = 0; i != array.length; ++i) {
           // 去掉首末两端的双引号
           var s = array[i].substring(1, array[i].length() - 1);
           s = s.replace("\\", "").replace("\\", "");
    //                    // http://res.gufengmh8.com/images/comic/159/316518/1519527843Efo9qfJOY9Jb_VP4.jpg
           list.add(new ImageUrl(i + 1, base_url+s, false));
           Log.d("地址", "parseImages: "+base_url+s);
       }
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "/list/"));
    list.add(Pair.create("儿童漫画", "/list/ertong/"));
    list.add(Pair.create("少年漫画", "/list/shaonian/"));
    list.add(Pair.create("少女漫画", "/list/shaonv/"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://m.imitui.com"+format+"?page="+page;
   Log.d("请求地址", "getCategoryRequest: "+url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list("#comic-items > .list-comic");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cover = node.attr(".ImgA img", "src");
        var title = node.text(".txtA");
        var cid = node.attr(".ImgA", "href").replace("https://m.imitui.com/manhua/", "");
        cid = cid.substring(0, cid.length() - 1);
        var update = "";
        var author = node.text(".info");
        author = author.replace("作者:", "");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}