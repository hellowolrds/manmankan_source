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
var title = "百年漫画";
// 类型，相当于java中TYPE
var sort = 11;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "https://m.bnmanhua.com/search/" + keyword + "/"+ page +".html";
    return new Request.Builder()
            .addHeader("Referer", "https://m.bnmanhua.com/")
            .addHeader("Host", "m.bnmanhua.com")
            .url(url)
            .build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("ul.tbox_m > li.vbox");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a.vbox_t", "href").substring(7);
        var title = node.attr("a.vbox_t", "title");
        var cover = node.attr("a.vbox_t > mip-img", "src");
        var update = node.text("h4:eq(2)");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {

     var url = cid.indexOf(".html") > 0 ? "http://m.bnmanhua.com/comic/".concat(cid)
                    : "http://m.bnmanhua.com/comic/".concat(cid).concat(".html");
     return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("div.dbox > div.data > h4");
    var cover = body.attr("div.dbox > div.img > mip-img", "src");
    var update = body.text("div.dbox > div.data > p.act").substring(3, 13).trim();
    var intro = body.text("div.tbox_js");
    var author = body.text("div.dbox > div.data > p.dir").substring(3).trim();
    var status = body.text("span.list_item").indexOf("完结")>0?true:false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("div.tabs_block > ul > li > a");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit(2);
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
     cid = cid.substring(0, cid.length - 5);
     var url = StringUtils.format("http://m.bnmanhua.com/comic/%s/%s.html", cid, path);
     Log.d("图片详情", url);
     return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "https://m.bnmanhua.com");
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
    var base_url = "https://img.yaoyaoliao.com/";
    var image_list = StringUtils.match("z_img='(.*?)]';", content, 1);
    image_list = image_list.replace("[", "");
    var arr = image_list.split(",");
    for (var i = 0; i < arr.length; i ++) {
        var url = arr[i];
        url = url.replace("\"", "");
        url = base_url + url;
        Log.d("jpg_list", "parseImages: "+url);
        list.add(new ImageUrl(i+1, url,false));
        i++;
    }
    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("全部", "/list/%s.html"));
   list.add(Pair.create("少年漫画", "/list/shaonian/%s.html"));
   list.add(Pair.create("少女漫画", "/list/shaonv/%s.html"));
   list.add(Pair.create("青年漫画", "/list/qingnian/%s.html"));
   list.add(Pair.create("女性漫画", "/list/nvxing/%s.html"));
   list.add(Pair.create("大陆漫画", "/list/dalu/%s.html"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://m.bnmanhua.com" + format;
   url = StringUtils.format(url, page+"");
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list(".tbox_m > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a.vbox_t", "href").substring(7);
        var title = node.attr("a.vbox_t", "title");
        var cover = node.attr("a.vbox_t > mip-img", "src");
        Log.d("图片地址", cover);
        var update = node.text(".vbox_t > span");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}