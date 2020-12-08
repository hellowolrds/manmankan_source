importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importClass(Packages.okhttp3.Request)
importClass(Packages.okhttp3.Headers)
importClass(Packages.okhttp3.FormBody)
importClass(Packages.okhttp3.RequestBody)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)


// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "有妖气";
// 类型，相当于java中TYPE
var sort = 5;

//第一个方法返回搜索请求函数
function getSearchRequest (keyword, page) {
    var url = "http://so.u17.com/all/"+ keyword +"/m0_p" + page + ".html";
    Log.d("请求头", url);
    return new Request.Builder()
            .url(url)
            .build();
}

// 解析搜索页面
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("#comiclist > div.search_list > div.comiclist > ul > li > div");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("div:eq(1) > h3 > strong > a", 1);
        var title = node.attr("div:eq(1) > h3 > strong > a", "title");
        var cover = node.src("div:eq(0) > a > img");
        var update = node.textWithSubstring("div:eq(1) > h3 > span.fr", 7);
        var author = node.text("div:eq(1) > h3 > a[title]");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = StringUtils.format("http://www.u17.com/comic/%s.html", cid);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("div.comic_info > div.left > h1.fl");
    var cover = body.src("div.comic_info > div.left > div.coverBox > div.cover > a > img");
    var update = body.textWithSubstring("div.main > div.chapterlist > div.chapterlist_box > div.bot > div.fl > span", 7);
    var author = body.text("div.comic_info > div.right > div.author_info > div.info > a.name");
    var intro = body.text("#words");
    var status = false;
//    Log.d("测试", "parseInfo: "+intro);
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);

    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#chapter > li > a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i > 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.hrefWithSplit(1);
        list.add(new Chapter(title, path));
    }
    return list;
}

//请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://www.u17.com/comic/ajax.php?mod=chapter&act=get_chapter_v5&chapter_id=".concat(path);
    return new Request.Builder()
                .url(url)
                .build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://www.u17.com");
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
    var object = new JSONObject(content);
    var array = object.getJSONArray("image_list");
    for (var i = 0; i < array.length(); ++i) {
        var url = array.getJSONObject(i).getString("src");
        list.add(new ImageUrl(i + 1, url, false));
    }

    return list;
}

// 获取分类
function get_subject () {
    var url = "http://www.js518.net/%s/%%s.html";
    var list = new ArrayList();
    list.add(Pair.create("全部", "no no no no"));
    list.add(Pair.create("搞笑", "1 no no no"));
    list.add(Pair.create("魔幻", "2 no no no"));
    list.add(Pair.create("生活", "3 no no no"));
    list.add(Pair.create("恋爱", "4 no no no"));
    list.add(Pair.create("动作", "5 no no no"));
    list.add(Pair.create("科幻", "6 no no no"));
    list.add(Pair.create("战争", "7 no no no"));
    list.add(Pair.create("体育", "8 no no no"));
    list.add(Pair.create("推理", "9 no no no"));
    list.add(Pair.create("惊悚", "11 no no no"));
    list.add(Pair.create("同人", "12 no no no"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var args = format.split(" ");
    var url = "https://www.u17.com/comic/ajax.php?mod=comic_list&act=comic_list_new_fun&a=get_comic_list";
    var body = new FormBody.Builder()
            .add("data[group_id]", args[0])
            .add("data[theme_id]", args[1])
            .add("data[is_vip]", "no")
            .add("data[accredit]", "no")
            .add("data[color]", "no")
            .add("data[comic_type]", "no")
            .add("data[series_status]", args[2])
            .add("data[order]", args[3])
            .add("data[page_num]", page + "")
            .add("data[read_mode]", "no")
            .build();
    return new Request.Builder().url(url).post(body).addHeader("Referer", "http://www.u17.com").build();
}

//解析推荐
function parseCategory() {
   var list = new ArrayList();
   var jsonObject1 = new JSONObject(content);
   var array = jsonObject1.getJSONArray("comic_list");
   for (var i = 0; i <array.length(); i ++) {
        var object = array.getJSONObject(i);
        var cid = object.getString("comic_id");
        var title = object.getString("name");
        var cover = object.getString("cover");
        list.add(new Comic(sort, cid, title, cover, null, null));
   }


   return list;

}