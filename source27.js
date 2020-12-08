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
importClass(Packages.java.util.regex.Matcher)
importClass(Packages.java.util.regex.Pattern)


// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "我要去漫画";
// 类型，相当于java中TYPE
var sort = 27;

// 请求头
function getSearchRequest (keyword, page) {
    var url = StringUtils.format("http://m.517manhua.com/statics/search.aspx?key=%s", keyword);
    return new Request.Builder()
       .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
       .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    Log.d("内容", content);
    var searchList = body.list("ul#listbody > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.href("a.ImgA");
        var title = node.text("a.txtA");
        var cover = node.attr("a.ImgA > img", "src");
        list.add(new Comic(sort, cid, title, cover, "", ""));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   if (cid.indexOf("http://m.517manhua.com") == -1) {
       cid = "http://m.517manhua.com".concat(cid);
   }
   return new Request.Builder().url(cid).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.attr("div#Cover > img", "title");
    var cover = body.src("div#Cover > img");
    var update = "";
    var author = "";
    var intro = body.text("p.txtDesc");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#mh-chapter-list-ol-0 > li");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text("a > span");
        var path = node.hrefWithSplit("a", 2);
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    path = StringUtils.format("http://m.517manhua.com%s/%s.html", cid, path);
    return new Request.Builder().url(path).build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.517manhua.com/");
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
    var pageMatcher = Pattern.compile("qTcms_S_m_murl_e=\"(.*?)\"").matcher(content);
    var mangaid = StringUtils.match("var qTcms_S_m_id=\"(\\w+?)\";", content, 1);
    if (!pageMatcher.find()) return null;
    var imgArrStr = DecryptionUtils.base64Decrypt(pageMatcher.group(1));
    var arr = imgArrStr.split("\\$.*?\\$");
    for (var i = 0; i < arr.length; i ++) {
       var item = arr[i];
//       var url = "http://m.517manhua.com/statics/pic/?p=" + item + "&wapif=1&picid=" + mangaid + "&m_httpurl=";
//       Log.d("地址", item);
       list.add(new ImageUrl(i+1, item, false));
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "0"));
    list.add(Pair.create("少年", "1101"));
    list.add(Pair.create("少女", "1102"));
    list.add(Pair.create("青年", "1103"));
    list.add(Pair.create("少儿", "1104"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "http://m.517manhua.com/statics/qingtiancms.ashx";
     var body = new FormBody.Builder()
             .add("page", page+"")
             .add("action", "GetWapList")
             .add("_id", "listbody")
             .add("pagesize", "12")
             .add("order", "1")
             .add("classid1", "0")
             .add("url", "/statics/qingtiancms.ashx")
             .add("typereader", format)
             .build();
     return new Request.Builder().url(url).post(body).addHeader("Referer", "http://m.dm5.com").build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    Log.d("内容", content);
    var searchList = body.list("li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
         var node = searchList.get(i);
         var title = node.text("a.txtA");
         var cid = node.href("a.ImgA");
         var cover = node.attr("a.ImgA > img", "src");
         var update = node.attr(".info");
         var author = "";
         list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}