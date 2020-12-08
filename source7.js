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

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "517漫画";
// 类型，相当于java中TYPE
var sort = 7;

// 请求头
function getSearchRequest (keyword, page) {
   if (page == 1) {
        var url = "http://www.517mh.net/sort/?key="+keyword;
        return new Request.Builder().url(url).build();
    }
    return null;
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".comic-list .item");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".info .title");
        var cover = node.attr("img", "data-src");
        var temp = node.text(".info .desc");
        var str = temp.split(" ");
        list.add(new Comic(sort, cid, title, cover, str[1], str[0]));
    }

    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    cid = cid.replace(/_/g, "/");
    var url = "http://www.517mh.net/"+cid;
    Log.d("测试是是是", "getImagesRequest: "+url);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".warp-main .title-warper .title");
    var cover = body.attr(".warp-main .comic-cover img", "data-src");
    var update = body.text("#randomColor c1");
    var intro = body.text("#layerOpenCon");
    var author = "未知";
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);

    var chapterList = body.list("#chapterList li");
    var list = new ArrayList();

    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.attr("a", "href");
        list.add(new Chapter(title, path));
    }

    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
   var url = "http://www.517mh.net/" + path;
   return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "http://www.hhmmoo.com");
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
    var base_url = "http://image.xmanhua.com/";
    var data = StringUtils.match("chapter_list_all:(.+)]", content, 1);
    data = data.replace("[", "");
    var image_urls = data.split(",");
    for (var i = 0; i < image_urls.length; i ++) {
        var url = image_urls[i];
        url = url.replace("\"", "").replace("\"", "");
        list.add(new ImageUrl(i+1, url,false));
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "/sort/"));
    list.add(Pair.create("少年热血", "/manhua/rexue/"));
    list.add(Pair.create("武侠格斗", "/manhua/gedou/"));
    list.add(Pair.create("科幻魔幻", "/manhua/kehuan/"));
    list.add(Pair.create("竞技体育", "/manhua/tiyu/"));
    list.add(Pair.create("爆笑喜剧", "/manhua/xiju/"));
    list.add(Pair.create("侦探推理", "/manhua/tuili/"));
    list.add(Pair.create("其他漫画", "/manhua/qita/"));
    list.add(Pair.create("恐怖灵异", "/manhua/kongbulingyi/"));
    list.add(Pair.create("耽美人生", "/manhua/danmeirensheng/"));
    list.add(Pair.create("少女爱情", "/manhua/shaonvaiqing/"));
    list.add(Pair.create("恋爱生活", "/manhua/lianaishenghuo/"));
    list.add(Pair.create("生活漫画", "/manhua/shenghuomanhua/"));
    list.add(Pair.create("战争漫画", "/manhua/zhanzhengmanhua/"));
    list.add(Pair.create("故事漫画", "/manhua/gushimanhua/"));
    list.add(Pair.create("韩国漫画", "/manhua/hanguomanhua/"));
    list.add(Pair.create("中国漫画", "/manhua/zhongguomanhua/"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url =  "http://www.517mh.net/" + format+"/index_" + page + ".html";

    return new Request.Builder()
    .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list(".comic-list .item");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".info .title");
        var cover = node.attr("img", "data-src");
        var temp = node.text(".info .desc");
        var str = temp.split(" ");
        list.add(new Comic(sort, cid, title, cover, str[1], str[0]));
    }
    return list;
}