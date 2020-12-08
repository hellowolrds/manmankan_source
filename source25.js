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
var title = "下拉漫画";
// 类型，相当于java中TYPE
var sort = 25;

// 请求头
function getSearchRequest (keyword, page) {
     var url = "";
     if (page == 1) {
         url = StringUtils.format("https://xiala5.com/sort/?key=%s&page=%s", keyword, page+"");
         Log.d("网页内容", "getSearchIterator: "+url);
     }
    return new Request.Builder()
         .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
         .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".cy_list_mh ul");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cover = node.attr("li:first-child .pic img", "src");
        var title = node.text(".title");
        var cid = node.hrefWithSplit(".title > a", 1);
        var update = node.text(".updata a");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = StringUtils.format("https://xiala5.com/manhua/%s/", cid);
   return new Request.Builder().url(url)
           .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
           .build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var update = "";
    var title = body.text("#intro_l .cy_title h1");
    var intro = body.text("#comic-description");
    var author = body.text("#intro_l .cy_xinxi span:first-child").replace("作者：", "");
    var cover = body.src("#intro_l .cy_info_cover .pic");
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#mh-chapter-list-ol-0 li");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text("a");
        var path =  node.href("a");
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "https://xiala5.com/"+path;
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
    var images_str = StringUtils.match("url\":(.+)\",\"sum", content, 1);
    images_str = images_str.replace("\"", "").replace("\"", "");
    var img_list = images_str.split("\\|72cms\\|");
    Log.d("电视", "parseImages: "+img_list[0]);
    for (var i = 0 ; i < img_list.length; i ++) {
      list.add(new ImageUrl(i+1, img_list[i], false));
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "/sort/"));
    list.add(Pair.create("热血", "/sort/t1/"));
    list.add(Pair.create("机战", "/sort/t2/"));
    list.add(Pair.create("运动", "/sort/t3/"));
    list.add(Pair.create("推理", "/sort/t4/"));
    list.add(Pair.create("冒险", "/sort/t5/"));
    list.add(Pair.create("搞笑", "/sort/t8/"));
    list.add(Pair.create("战争", "/sort/t9/"));
    list.add(Pair.create("神魔", "/sort/t10/"));
    list.add(Pair.create("忍者", "/sort/t11/"));
    list.add(Pair.create("竞技", "/sort/t12/"));
    list.add(Pair.create("悬疑", "/sort/t13/"));
    list.add(Pair.create("社会", "/sort/t14/"));
    list.add(Pair.create("恋爱", "/sort/t15/"));
    list.add(Pair.create("宠物", "/sort/t16/"));
    list.add(Pair.create("吸血", "/sort/t17/"));
    list.add(Pair.create("萝莉", "/sort/t18/"));
    list.add(Pair.create("后宫", "/sort/t19/"));
    list.add(Pair.create("御姐", "/sort/t20/"));
    list.add(Pair.create("霸总", "/sort/t21/"));
    list.add(Pair.create("玄幻", "/sort/t22/"));
    list.add(Pair.create("古风", "/sort/t23/"));
    list.add(Pair.create("历史", "/sort/t24/"));
    list.add(Pair.create("漫改", "/sort/t25/"));
    list.add(Pair.create("游戏", "/sort/t26/"));
    list.add(Pair.create("穿越", "/sort/t27/"));
    list.add(Pair.create("恐怖", "/sort/t28/"));
    list.add(Pair.create("真人", "/sort/t29/"));
    list.add(Pair.create("科幻", "/sort/t30/"));
    list.add(Pair.create("都市", "/sort/t31/"));
    list.add(Pair.create("武侠", "/sort/t32/"));
    list.add(Pair.create("修真", "/sort/t33/"));
    list.add(Pair.create("生活", "/sort/t34/"));
    list.add(Pair.create("动作", "/sort/t35/"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://xiala5.com"+ format + page +".html";
   Log.d("请求地址", "getCategoryRequest: "+url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    Log.d("内容", content);
    var searchList = body.list(".cy_list_r .cy_list_mh > ul");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
         var node = searchList.get(i);
         var cover = node.attr("li:first-child .pic img", "src");
         var title = node.text(".title");
         var cid = node.hrefWithSplit(".title > a", 1);
         var update = node.text(".updata a");
         var author = "";
         list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}
