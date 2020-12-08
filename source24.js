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
var title = "997700";
// 类型，相当于java中TYPE
var sort = 24;
var serverstr = "http://20.125084.com/dm01/|http://20.125084.com/dm02/|http://20.125084.com/dm03/|http://20.125084.com/dm04/|http://20.125084.com/dm05/|http://20.125084.com/dm06/|http://20.125084.com/dm07/|http://20.125084.com/dm08/|http://20.125084.com/dm09/|http://20.125084.com/dm10/|http://20.125084.com/dm11/|http://20.125084.com/dm12/|http://20.125084.com/dm13/|http://20.125084.com/dm14/|http://20.125084.com/dm15/|http://20.125084.com/dm16/";
var servers = serverstr.split("|");
// 请求头
function getSearchRequest (keyword, page) {
     var url = "";
     if (page == 1)
        url = "http://99770.hhxxee.com/search/s.aspx";
     var requestBodyPost = new FormBody.Builder()
             .add("tbSTxt", keyword)
             .build();
     return new Request.Builder().url(url)
             .post(requestBodyPost).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".cInfoItem");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.href(".cListTitle > a").substring("http://99770.hhxxee.com/comic/".length);
        var title = node.text(".cListTitle > span");
        title = title.substring(1, title.length() - 1);
        var cover = node.src(".cListSlt > img");
        var update = node.text(".cListh2 > span").substring(8);
        var author = node.text(".cl1_2").substring(3);
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = "http://99770.hhxxee.com/comic/".concat(cid);
   return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var cover = body.src(".cDefaultImg > img");
    var intro = body.text(".cCon");
    var title = body.text(".cTitle");
    var update = body.text(".cInfoTxt tr:nth-child(5) td:last-child a");
    var author = body.text(".cInfoTxt tr:nth-child(2) td:last-child");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#subBookListAct > div");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text("a");
        var path =  node.hrefWithSplit("a", 2);
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("http://99770.hhxxee.com/comic/%s/%s/", cid, path);
    return new Request.Builder().url(url).build();
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
    var str = StringUtils.match("var sFiles=\"(.*?)\"", content, 1);
    if (str != null) {
        var array = str.split("\\|");
        for (var i = 0; i != array.length; ++i) {
            Log.d("图片地址", servers);
            list.add(new ImageUrl(i + 1, servers[getPictureServers(array[i])] + array[i], false));
        }
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("漫畫列表", "http://99770.hhxxee.com/comiclist/0"));
    list.add(Pair.create("萌系", "http://99770.hhxxee.com/comiclist/1"));
    list.add(Pair.create("搞笑", "http://99770.hhxxee.com/comiclist/2"));
    list.add(Pair.create("格斗", "http://99770.hhxxee.com/comiclist/3"));
    list.add(Pair.create("科幻", "http://99770.hhxxee.com/comiclist/4"));
    list.add(Pair.create("劇情", "http://99770.hhxxee.com/comiclist/5"));
    list.add(Pair.create("偵探", "http://99770.hhxxee.com/comiclist/6"));
    list.add(Pair.create("競技", "http://99770.hhxxee.com/comiclist/7"));
    list.add(Pair.create("魔法", "http://99770.hhxxee.com/comiclist/8"));
    list.add(Pair.create("神鬼", "http://99770.hhxxee.com/comiclist/9"));
    list.add(Pair.create("校園", "http://99770.hhxxee.com/comiclist/10"));
    list.add(Pair.create("驚栗", "http://99770.hhxxee.com/comiclist/11"));
    list.add(Pair.create("廚藝", "http://99770.hhxxee.com/comiclist/12"));
    list.add(Pair.create("圖片", "http://99770.hhxxee.com/comiclist/14"));
    list.add(Pair.create("冒險", "http://99770.hhxxee.com/comiclist/15"));
    list.add(Pair.create("小說", "http://99770.hhxxee.com/comiclist/19"));
    list.add(Pair.create("港漫", "http://99770.hhxxee.com/comiclist/20"));
    list.add(Pair.create("經典", "http://99770.hhxxee.com/comiclist/22"));
    list.add(Pair.create("歐美", "http://99770.hhxxee.com/comiclist/23"));
    list.add(Pair.create("日文", "http://99770.hhxxee.com/comiclist/24"));
    list.add(Pair.create("親情", "http://99770.hhxxee.com/comiclist/25"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = format + "/" + page + "/";
   Log.d("请求地址", "getCategoryRequest: "+url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    Log.d("内容", content);
    var searchList = body.list(".cComicList > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
         var node = searchList.get(i);
         var cid = node.href("a").substring("http://99770.hhxxee.com/comic/".length);
         var title = node.attr("a", "title");
         var cover = node.attr("img", "src");
         var update = node.text(".clw1");
         var author = node.text(".ctor");
         list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}







function getPictureServers (url) {
    return Integer.parseInt(StringUtils.match("ok\\-comic(\\d+)", url, 1)) - 1;
}