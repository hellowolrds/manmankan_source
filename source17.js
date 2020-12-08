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
var title = "漫画DB";
// 类型，相当于java中TYPE
var sort = 17;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        url = StringUtils.format("https://www.manhuadb.com/search?q=%s", keyword);
    }
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("a.d-block");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(1);
        var title = node.attr("title");
        var cover = node.attr("img", "data-original");
        list.add(new Comic(sort, cid, title, cover, null, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://www.manhuadb.com/manhua/".concat(cid);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("h1.comic-title");
    var cover = body.src("td.comic-cover > img");
    var update = body.text("a.comic-pub-end-date");
    if (update == null || update.equals("")) {
        update = body.text("a.comic-pub-date");
    }
    var intro = body.text("p.comic_story");
    var author = body.text("a.comic-creator");
    var status = body.text("a.comic-pub-state").indexOf("完结")>0?true:false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#comic-book-list > div > ol > li > a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit(2);
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("https://www.manhuadb.com/manhua/%s/%s.html", cid, path);
    return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "https://www.manhuadb.com");
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
    var imageHost = StringUtils.match("data-host=\"(.*?)\"", content, 1);
    var imagePre = StringUtils.match("data-img_pre=\"(.*?)\"", content, 1);
    var base64Data = StringUtils.match("var img_data = '(.*?)';", content, 1);
    var jsonStr = DecryptionUtils.base64Decrypt(base64Data);
    var imageList = new JSONArray(jsonStr);

    for(var i = 0; i < imageList.length(); i++ ) {
        var image = imageList.getJSONObject(i);
        var imageUrl = imageHost + imagePre + image.getString("img");
        list.add(new ImageUrl(i+1, imageUrl, false));
    }

    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("爱情", "/manhua/list-c-26-page-%s.html"));
   list.add(Pair.create("东方", "/manhua/list-c-66-page-%s.html"));
   list.add(Pair.create("冒险", "/manhua/list-c-12-page-%s.html"));
   list.add(Pair.create("欢乐向", "/manhua/list-c-64-page-%s.html"));
   list.add(Pair.create("搞笑", "/manhua/list-c-41-page-%s.html"));
   list.add(Pair.create("科幻", "/manhua/list-c-20-page-%s.html"));
   list.add(Pair.create("校园", "/manhua/list-c-40-page-%s.html"));
   list.add(Pair.create("生活", "/manhua/list-c-33-page-%s.html"));
   list.add(Pair.create("魔幻", "/manhua/list-c-48-page-%s.html"));
   list.add(Pair.create("热血", "/manhua/list-c-46-page-%s.html"));
   list.add(Pair.create("奇幻", "/manhua/list-c-13-page-%s.html"));
   list.add(Pair.create("格斗", "/manhua/list-c-44-page-%s.html"));
   list.add(Pair.create("神鬼", "/manhua/list-c-52-page-%s.html"));
   list.add(Pair.create("魔法", "/manhua/list-c-43-page-%s.html"));
   list.add(Pair.create("悬疑", "/manhua/list-c-27-page-%s.html"));
   list.add(Pair.create("动作", "/manhua/list-c-18-page-%s.html"));
   list.add(Pair.create("竞技", "/manhua/list-c-55-page-%s.html"));
   list.add(Pair.create("喜剧", "/manhua/list-c-32-page-%s.html"));
   list.add(Pair.create("萌系", "/manhua/list-c-59-page-%s.html"));
   list.add(Pair.create("恐怖", "/manhua/list-c-16-page-%s.html"));
   list.add(Pair.create("四格", "/manhua/list-c-56-page-%s.html"));
   list.add(Pair.create("治愈", "/manhua/list-c-54-page-%s.html"));
   list.add(Pair.create("励志", "/manhua/list-c-47-page-%s.html"));
   list.add(Pair.create("舰娘", "/manhua/list-c-73-page-%s.html"));
   list.add(Pair.create("职场", "/manhua/list-c-58-page-%s.html"));
   list.add(Pair.create("战争", "/manhua/list-c-30-page-%s.html"));
   list.add(Pair.create("侦探", "/manhua/list-c-51-page-%s.html"));
   list.add(Pair.create("惊悚", "/manhua/list-c-21-page-%s.html"));
   list.add(Pair.create("职业", "/manhua/list-c-22-page-%s.html"));
   list.add(Pair.create("体育", "/manhua/list-c-11-page-%s.html"));
   list.add(Pair.create("历史", "/manhua/list-c-9-page-%s.html"));
   list.add(Pair.create("美食", "/manhua/list-c-45-page-%s.html"));
   list.add(Pair.create("秀吉", "/manhua/list-c-68-page-%s.html"));
   list.add(Pair.create("推理", "/manhua/list-c-19-page-%s.html"));
   list.add(Pair.create("音乐舞蹈", "/manhua/list-c-70-page-%s.html"));
   list.add(Pair.create("后宫", "/manhua/list-c-57-page-%s.html"));
   list.add(Pair.create("机战", "/manhua/list-c-61-page-%s.html"));
   list.add(Pair.create("节操", "/manhua/list-c-76-page-%s.html"));
   list.add(Pair.create("料理", "/manhua/list-c-29-page-%s.html"));
   list.add(Pair.create("音乐", "/manhua/list-c-17-page-%s.html"));
   list.add(Pair.create("武侠", "/manhua/list-c-23-page-%s.html"));
   list.add(Pair.create("西方魔幻", "/manhua/list-c-65-page-%s.html"));
   list.add(Pair.create("AA", "/manhua/list-c-78-page-%s.html"));
   list.add(Pair.create("社会", "/manhua/list-c-37-page-%s.html"));
   list.add(Pair.create("资料集", "/manhua/list-c-28-page-%s.html"));
   list.add(Pair.create("宅男", "/manhua/list-c-49-page-%s.html"));
   list.add(Pair.create("传记", "/manhua/list-c-10-page-%s.html"));
   list.add(Pair.create("黑道", "/manhua/list-c-62-page-%s.html"));
   list.add(Pair.create("舞蹈", "/manhua/list-c-50-page-%s.html"));
   list.add(Pair.create("灾难", "/manhua/list-c-34-page-%s.html"));
   list.add(Pair.create("轻小说", "/manhua/list-c-69-page-%s.html"));
   list.add(Pair.create("杂志", "/manhua/list-c-42-page-%s.html"));
   list.add(Pair.create("宅系", "/manhua/list-c-77-page-%s.html"));
   list.add(Pair.create("颜艺", "/manhua/list-c-74-page-%s.html"));
   list.add(Pair.create("腐女", "/manhua/list-c-63-page-%s.html"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://www.manhuadb.com" + format;
   url = StringUtils.format(url, page+"");
   Log.d("请求地址", "getCategoryRequest: "+url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list(".comic-main-section > .comic-book-unit");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(".d-block", -1);
        var title = node.text(".h3 a");
        var cover = node.attr(".comic-book-cover", "data-original");
        var update = "";
        var author = node.text(".list-inline-item a");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}