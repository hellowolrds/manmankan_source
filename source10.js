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
var title = "狂人漫画";
// 类型，相当于java中TYPE
var sort = 10;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "http://www.krmanhua.com/search/?keywords="+ keyword +"&page=" + page;
           return new Request.Builder()
          .url(url)
          .build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("#contList .item-lg");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr(".ell a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".ell a");
        var cover = node.attr("img", "src");
        var update = node.text(".tt");

        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = cid.replace(/_/g, "/");
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".book-detail .book-title h1");
    var cover = body.src(".pic");
    var update = body.text(".book-detail .detail-list li:eq(2) span:last-child a");
    var intro = body.text("#intro-all");
    var author = body.text(".book-detail .detail-list li:eq(1) span:last-child a");
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
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://www.krmanhua.com" + path;
    return new Request.Builder()
            .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
            .url(url)
            .build();
}

function getHeader () {
    return Headers.of("Referer", "http://images.dmzj.com/");
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

    var base_url = "http://pic1.krmanhua.com:8001/";
    var jpg_root = StringUtils.match("chapterPath = (.+)\";var pageTitle ", content, 1);
    var jpg_list = StringUtils.match("var chapterImages = (.+)];", content, 1);

    jpg_root = jpg_root.replace("\"", "");
    jpg_list = jpg_list.replace("[", "");

    var arr = jpg_list.split(",");
    for (var i = 0; i < arr.length; i ++) {
        var url = arr[i];
        url = url.replace("\"", "").replace("\"", "");
        var s = base_url + jpg_root + url;
        Log.d("jpg_list", "parseImages: "+s);
        list.add(new ImageUrl(i+1, s,false));
        i++;
    }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "/list_%s/"));
    list.add(Pair.create("儿童漫画", "/list/ertong/%s/"));
    list.add(Pair.create("少儿漫画", "/list/shaonian/%s/"));
    list.add(Pair.create("青年漫画", "/list/qingnian/%s/"));

    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "http://www.krmanhua.com"+format;
   url = StringUtils.format(url, page+"");
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list("#contList .item-lg");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr(".ell a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".ell a");
        var cover = node.attr("img", "src");
        Log.d("图片地址", cover);
        var update = node.text(".tt");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}