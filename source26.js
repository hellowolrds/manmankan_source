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
var title = "看漫画啦";
// 类型，相当于java中TYPE
var sort = 26;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        var url = StringUtils.format("https://kanmanhuala.com/search?keyword=%s", keyword);
    }
    return new Request.Builder()
       .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
       .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".book-list > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cover = node.attr(".book-list-cover-img", "data-original");
        var title = node.text(".book-list-info-title");
        var cid = node.hrefWithSplit(".book-list-info > a", -1);
        var author = node.text(".book-list-info-bottom-item");
        author = author.replace("作者：", "");
        var update = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = "https://kanmanhuala.com/book/".concat(cid);
   return new Request.Builder()
           .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
           .url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".detail-main .detail-main-info-title");
    var cover = body.attr(".detail-main-cover img", "data-original");
    var update = "";
    var author = body.text(".detail-main-info:nth-child(2) a");
    var intro = body.text(".detail-desc");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#detail-list-select li");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text("a");
        var path = node.href("a");
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "https://kanmanhuala.com"+path;
    return new Request.Builder()
            .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
            .url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "http://99770.hhxxee.com");
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
    var body = new Node(content);
    var chapterList = body.list("#cp_img img");
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        list.add(new ImageUrl(i+1, node.attr("img", "data-original"), false));
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("日常", "/booklist?tag=日常&page=%s"));
    list.add(Pair.create("腹黑", "/booklist?tag=腹黑&page=%s"));
    list.add(Pair.create("都市", "/booklist?tag=都市&page=%s"));
    list.add(Pair.create("穿越", "/booklist?tag=穿越&page=%s"));
    list.add(Pair.create("烧脑", "/booklist?tag=烧脑&page=%s"));
    list.add(Pair.create("治愈", "/booklist?tag=治愈&page=%s"));
    list.add(Pair.create("萌系", "/booklist?tag=萌系&page=%s"));
    list.add(Pair.create("古风", "/booklist?tag=古风&page=%s"));
    list.add(Pair.create("玄幻", "/booklist?tag=玄幻&page=%s"));
    list.add(Pair.create("猎奇", "/booklist?tag=猎奇&page=%s"));
    list.add(Pair.create("奇幻", "/booklist?tag=奇幻&page=%s"));
    list.add(Pair.create("搞笑", "/booklist?tag=搞笑&page=%s"));
    list.add(Pair.create("推理", "/booklist?tag=推理&page=%s"));
    list.add(Pair.create("悬疑", "/booklist?tag=悬疑&page=%s"));
    list.add(Pair.create("武侠", "/booklist?tag=武侠&page=%s"));
    list.add(Pair.create("仙侠", "/booklist?tag=仙侠&page=%s"));
    list.add(Pair.create("后宫", "/booklist?tag=后宫&page=%s"));
    list.add(Pair.create("冒险", "/booklist?tag=冒险&page=%s"));
    list.add(Pair.create("彩虹", "/booklist?tag=彩虹&page=%s"));
    list.add(Pair.create("百合", "/booklist?tag=百合&page=%s"));
    list.add(Pair.create("校园", "/booklist?tag=校园&page=%s"));
    list.add(Pair.create("恋爱", "/booklist?tag=恋爱&page=%s"));
    list.add(Pair.create("热血", "/booklist?tag=热血&page=%s"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://kanmanhuala.com"+format;
   url = StringUtils.format(url, page);
   return new Request.Builder()
           .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
           .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    Log.d("内容", content);
    var searchList = body.list(".manga-list-2 > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
         var node = searchList.get(i);
         var cover = node.attr(".manga-list-2-cover-img", "data-original");
         var title = node.text(".manga-list-2-title");
         var cid = node.hrefWithSplit(".manga-list-2-title > a", -1);
         var author = "";
         var update = node.text(".manga-list-2-tip");
         list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}
