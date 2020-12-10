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
var title = "看看漫画";
// 类型，相当于java中TYPE
var sort = 30;

// 请求头
function getSearchRequest (keyword, page) {
     var url = "";
     if (page == 1) {
         url = "http://www.kkmh.cc/art/search.html?wd="+keyword;
//         Log.d("网页内容", "getSearchIterator: "+url);
     }
    return new Request.Builder()
         .addHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
         .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("#J_comicList li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(".acgn-thumbnail", -2);
        var cover = node.attr(".cover", "data-src");
        var title = node.text(".acgn-title");
        var update = node.text(".acgn-desc");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = "http://www.kkmh.cc/art/content/id/"+cid+".html";
   Log.d("地址", url);
   return new Request.Builder().url(url)
           .addHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
           .build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    Log.d("网页内容", content);
    var body = new Node(content);
    var update = "";
    var title = body.text(".description h1");
    var intro = body.text(".introduce .desc-box");
    var author = "";
    var cover = body.attr(".mhjj .img-box img", "data-src");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#j_chapter_list li");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text(".name");
        var path =  node.href("a");
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://www.kkmh.cc"+path;
    return new Request.Builder()
        .addHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
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
    var node = new Node(content);
    var img_list = node.list("#reader-scroll img");
    for (var i = 0;i < img_list.size(); i ++) {
        var item = img_list.get(i);
        list.add(new ImageUrl(i+1, item.attr("data-original"), false));
    }


    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("恋爱", "恋爱"));
    list.add(Pair.create("校园", "校园"));
    list.add(Pair.create("动作", "动作"));
    list.add(Pair.create("总裁", "总裁"));
    list.add(Pair.create("恐怖", "恐怖"));
    list.add(Pair.create("古风", "古风"));
    list.add(Pair.create("搞笑", "搞笑"));
    list.add(Pair.create("其他", "其他"));
    list.add(Pair.create("热血", "热血"));
    list.add(Pair.create("异能", "异能"));
    list.add(Pair.create("御姐", "御姐"));
    list.add(Pair.create("玄幻", "玄幻"));
    list.add(Pair.create("穿越", "穿越"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
      var url = "http://www.kkmh.cc/art/show/id/5/page/"+page+"/tag/"+format+".html";
      Log.d("地址", url);
      return new Request.Builder().url(url)
              .addHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
              .build();
}

//解析推荐
function parseCategory() {
   var body = new Node(content);
   var searchList = body.list("#J_comicList li");
   var list = new ArrayList();
   for (var i = 0; i < searchList.size(); i ++) {
       var node = searchList.get(i);
       var cid = node.hrefWithSplit(".acgn-thumbnail", -2);
       var cover = node.attr(".cover", "data-src");
       var title = node.text(".acgn-title");
       var update = node.text(".acgn-desc");
       var author = "";
       list.add(new Comic(sort, cid, title, cover, update, author));
   }
   return list;
}
