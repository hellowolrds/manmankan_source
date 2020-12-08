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
var title = "土豪漫画";
// 类型，相当于java中TYPE
var sort = 13;
var website = "tuhao456.com";
// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        url = StringUtils.format("https://%s/sort/?key=%s", website, keyword);
    }
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("div.cy_list_mh > ul");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("li > a", 1);
        var title = node.text("li.title > a");
        var cover = node.attr("a.pic > img", "src");
        var update = node.text("li.updata > a > span");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://" + website + "/manhua/" + cid + "/";
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("div.cy_title > h1");
    var cover = body.src("img.pic");
    var update = "";
    var intro = body.text("p#comic-description");
    var author = body.text("div.cy_xinxi > span:eq(0)");
    var status = body.text("div.cy_xinxi > span:eq(1) > a").indexOf("完结")>0?true:false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("div.cy_plist > ul > li");
    var list = new ArrayList();
    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit("a", 1);
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
     var url = StringUtils.format("https://%s/chapter/%s.html", website, path);
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
    var str = StringUtils.match("\"page_url\":\"(.*?)\",", content, 1);
    Log.d("内容", "parseImages: "+str);
    var arr = str.split("\\|72cms\\|");
    for(var i = 0; i < arr.length; i ++) {
       var url = arr[i];
       list.add(new ImageUrl(i + 1, url, false));
    }
    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("全部", "/sort/%s.html"));
   list.add(Pair.create("热血", "/sort/t1/%s.html"));
   list.add(Pair.create("机战", "/sort/t2/%s.html"));
   list.add(Pair.create("运动", "/sort/t3/%s.html"));
   list.add(Pair.create("推理", "/sort/t4/%s.html"));
   list.add(Pair.create("冒险", "/sort/t5/%s.html"));
   list.add(Pair.create("搞笑", "/sort/t8/%s.html"));
   list.add(Pair.create("战争", "/sort/t9/%s.html"));
   list.add(Pair.create("神魔", "/sort/t10/%s.html"));
   list.add(Pair.create("忍者", "/sort/t11/%s.html"));
   list.add(Pair.create("竞技", "/sort/t12/%s.html"));
   list.add(Pair.create("悬疑", "/sort/t13/%s.html"));
   list.add(Pair.create("社会", "/sort/t14/%s.html"));
   list.add(Pair.create("恋爱", "/sort/t15/%s.html"));
   list.add(Pair.create("宠物", "/sort/t16/%s.html"));
   list.add(Pair.create("吸血", "/sort/t17/%s.html"));
   list.add(Pair.create("萝莉", "/sort/t18/%s.html"));
   list.add(Pair.create("后宫", "/sort/t19/%s.html"));
   list.add(Pair.create("御姐", "/sort/t20/%s.html"));
   list.add(Pair.create("霸总", "/sort/t21/%s.html"));
   list.add(Pair.create("玄幻", "/sort/t22/%s.html"));
   list.add(Pair.create("古风", "/sort/t23/%s.html"));
   list.add(Pair.create("历史", "/sort/t24/%s.html"));
   list.add(Pair.create("漫改", "/sort/t25/%s.html"));
   list.add(Pair.create("游戏", "/sort/t26/%s.html"));
   list.add(Pair.create("穿越", "/sort/t27/%s.html"));
   list.add(Pair.create("恐怖", "/sort/t28/%s.html"));
   list.add(Pair.create("真人", "/sort/t29/%s.html"));
   list.add(Pair.create("科幻", "/sort/t30/%s.html"));
   list.add(Pair.create("都市", "/sort/t31/%s.html"));
   list.add(Pair.create("武侠", "/sort/t32/%s.html"));
   list.add(Pair.create("修真", "/sort/t33/%s.html"));
   list.add(Pair.create("生活", "/sort/t34/%s.html"));
   list.add(Pair.create("动作", "/sort/t35/%s.html"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://www.tuhao456.com"+format;
   url = StringUtils.format(url, page);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list(".cy_list_mh > ul");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("li > a", 1);
        var title = node.text("li.title > a");
        var cover = node.attr("a.pic > img", "src");
        Log.d("图片地址", cover);
        var update = node.text("li.updata > a > span");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}