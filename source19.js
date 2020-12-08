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
importClass(Packages.com.reader.comic.utils.DecryptionUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "扑飞漫画";
// 类型，相当于java中TYPE
var sort = 19;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        url = StringUtils.format("http://m.pufei8.com/e/search/?searchget=1&tbname=mh&show=title,player,playadmin,bieming,pinyin,playadmin&tempid=4&keyboard=%s",
                            URLEncoder.encode(keyword, "GB2312"));
    }
    Log.d("网页地址", url);
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("#detail > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var node_a = node.list("a").get(0);
        var cid = node_a.hrefWithSplit(1);
        var title = node_a.text("h3");
        var cover = node_a.attr("div > img", "data-src");
        var author = node_a.text("dl > dd");
        var update = node.text("dl:eq(4) > dd");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "http://m.pufei8.com/manhua/".concat(cid);
    Log.d("网页内容", url);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("div.main-bar > h1");
    var cover = body.src("div.book-detail > div.cont-list > div.thumb > img");
    var update = body.text("div.book-detail > div.cont-list > dl:eq(2) > dd");

    var intro = body.text("#bookIntro");
    var author = body.text("div.book-detail > div.cont-list > dl:eq(3) > dd");
    var status = body.text("div.book-detail > div.cont-list > div.thumb > i").indexOf("完结")>0?true:false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#chapterList2 > ul > li > a");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.attr("title");
        var path = node.hrefWithSplit(2);
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("http://m.pufei8.com/manhua/%s/%s.html", cid, path);
    return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.pufei8.com");
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
    var str = StringUtils.match("cp=\"(.*?)\"", content, 1);
    if (str != null) {
        str = DecryptionUtils.evalDecrypt(DecryptionUtils.base64Decrypt(str));
        var array = str.split(",");
        for (var i = 0; i < array.length; i++) {
            list.add(new ImageUrl(i + 1, "http://res.img.youzipi.net/" + array[i], false));
        }
    }

    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("少年热血", "/shaonianrexue/index_%s.html"));
   list.add(Pair.create("少女爱情", "/shaonvaiqing/index_%s.html"));
   list.add(Pair.create("武侠格斗", "/wuxiagedou/index_%s.html"));
   list.add(Pair.create("科幻魔幻", "/kehuan/index_%s.html"));
   list.add(Pair.create("竞技体育", "/jingjitiyu/index_%s.html"));
   list.add(Pair.create("搞笑喜剧", "/gaoxiaoxiju/index_%s.html"));
   list.add(Pair.create("侦探推理", "/zhentantuili/index_%s.html"));
   list.add(Pair.create("恐怖灵异", "/kongbulingyi/index_%s.html"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    if (page == 1) {
        format = format.replace("_%s", "");
    }
    var url = "http://m.pufei8.com"+format;
    url = StringUtils.format(url, page+"");
    Log.d("网页内容", "getCategoryRequest: "+url);
    return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list("#detail li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var node_a = node.list("a").get(0);
        var cid = node_a.hrefWithSplit(1);
        var title = node_a.text("h3");
        var cover = node_a.attr("div > img", "data-src");
        var author = node_a.text("dl > dd");
        var update = node.text("dl:eq(4) > dd");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}