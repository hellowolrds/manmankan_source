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
var title = "漫客";
// 类型，相当于java中TYPE
var sort = 1;


//第一个方法返回搜索请求函数
function getSearchRequest (keyword, page) {
//    var url = StringUtils.format("http://api.zymk.cn/app_api/v5/getsortlist_new/?key=%s&page=%d", keyword, page);
    var url = "http://api.zymk.cn/app_api/v5/getsortlist_new/?key="+ keyword +"&page="+page;
    Log.d("请求头", url);

    return new Request.Builder()
            .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19")
            .url(url)
            .build();
}
// 解析搜索页面
function getSearchIterator() {
    var jsonObject = new JSONObject(content);
//    Log.d("json内容", html);
    var jsonObject1 = new JSONObject(jsonObject.getString("data"));
    var jsonObject2 = new JSONObject(jsonObject1.getString("page"));
    var chapterList = new JSONArray(jsonObject2.getString("comic_list"));
    var list = new ArrayList();
    for (var i = 0; i <chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("comic_id");
        var title = json.getString("comic_name");
        var cover = format_image(cid);
        var update = "";
        var author = json.getString("comic_feature");

        list.add(new Comic(sort, cid, title, cover, null, author));
    }

    return list;

}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://m.zymk.cn/"+cid;
    return new Request.Builder()
        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19")
        .url(url)
        .build();
}
//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".comic-info h1.name");
    var cover = body.attr(".comic-info .comic-item .thumbnail img", "data-src");
    var update = body.text("#updateTime");
    var author = body.text(".comic-info .author");
    var intro = body.text("#comicDetailTab .comic-detail .content");
    var status = false;

    var comic = new Comic(sort, "");

    comic.setInfo(title, cover, update, intro, author, status);

    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);

    var chapterList = body.list(".chapterlist li");
    var list = new ArrayList();

    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.attr("data-id");
        list.add(new Chapter(title, path));
    }

    return list;
}
// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://api.zymk.cn/app_api/v5/getcomicinfo/?comic_id="+cid;
    return new Request.Builder()
                .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3100.0 Safari/537.36")
//            .addHeader("Referer", StringUtils.format("https://m.manhuagui.com/comic/%s/%s.html", cid, path))
                .url(url)
                .build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://m.dmzj.com/");
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
//    Log.d("请求地址", content);
    var jsonObject1 = new JSONObject(content);
    var getData = new JSONObject(jsonObject1.get("data").toString());
//    Log.d("打印内容", "parseImages: "+getData.get("chapter_list"));
    var jsonArray = new JSONArray(getData.getString("chapter_list"));
//    Log.d("数量", "parseImages: "+jsonArray.length());
    for (var j = 0; j < jsonArray.length(); j ++) {
        var object = jsonArray.getJSONObject(j);
        var chapter_id = object.get("chapter_id").toString();
//        Log.d("章节id", "parse: "+chapter_id);
        if (chapter_id.equals(path)) {
            var count = Integer.parseInt(object.getString("end_var"));
            for (var i = 0; i < count; i ++) {
                var img = "http://mhpic.zymkcdn.com/comic/";
                var img_type = new JSONObject(object.getString("chapter_image"));
                img = img + img_type.getString("middle");
                img = img.replace("$$", (i + 1)+"");

                var imageUrl = new ImageUrl(i + 1, img, false);
                list.add(imageUrl);
            }
        }
    }

    return list;
}
// 获取分类
function get_subject () {
    var str= "热血::/?type=5&page=searchPage&&\n" +
            "搞笑::/?type=6&page=searchPage&&\n" +
            "玄幻::/?type=7&page=searchPage&&\n" +
            "生活::/?type=8&page=searchPage&&\n" +
            "恋爱::/?type=9&page=searchPage&&\n" +
            "动作::/?type=10&page=searchPage&&\n" +
            "科幻::/?type=11&page=searchPage&&\n" +
            "战争::/?type=12&page=searchPage&&\n" +
            "悬疑::/?type=13&page=searchPage&&\n" +
            "恐怖::/?type=14&page=searchPage&&\n" +
            "校园::/?type=15&page=searchPage&&\n" +
            "历史::/?type=16&page=searchPage&&\n" +
            "穿越::/?type=17&page=searchPage&&\n" +
            "后宫::/?type=18&page=searchPage&&\n" +
            "体育::/?type=19&page=searchPage&&\n" +
            "都市::/?type=20&page=searchPage&&\n" +
            "漫改::/?type=22&page=searchPage&&\n" +
            "修真::/?type=53&page=searchPage&&\n" +
            "霸总::/?type=62&page=searchPage&&\n" +
            "古风::/?type=63&page=searchPage&&\n" +
            "游戏::/?type=64&page=searchPage&&\n" +
            "真人::/?type=65&page=searchPage&&\n" +
            "武侠::/?type=66&page=searchPage&&\n" +
            "连载::/?type=23&page=searchPage&&\n" +
            "完结::/?type=24&page=searchPage&&\n" +
            "短篇::/?type=57&page=searchPage&&\n" +
            "少男::/?type=25&page=searchPage&&\n" +
            "少女::/?type=26&page=searchPage&&\n" +
            "青年::/?type=27&page=searchPage&&\n" +
            "知音漫客::/?type=28&page=searchPage&&\n" +
            "漫客栈::/?type=51&page=searchPage&&\n" +
            "神漫::/?type=29&page=searchPage&&\n" +
            "飒漫画::/?type=30&page=searchPage&&\n" +
            "飒漫乐画::/?type=52&page=searchPage&&\n" +
            "其他::/?type=58&page=searchPage";
    var arr = str.split("&&");
//    Log.d("测试", arr.length);
    var list = new ArrayList();
    for (var i = 0; i < arr.length; i ++) {
        var item = arr[i];
        var col = item.split("::");
        list.add(Pair.create(col[0], col[1]));
        Log.d("测试", item);
    }
    return list;
}


// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = "https://api.zymk.cn/app_api/v5/getsortlist_new"+format;
    url = url.replace("searchPage", page);
    return new Request.Builder()
                .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3100.0 Safari/537.36")
//            .addHeader("Referer", StringUtils.format("https://m.manhuagui.com/comic/%s/%s.html", cid, path))
                .url(url)
                .build();
}




//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var jsonObject1 = new JSONObject(content);
    var data = new JSONObject(jsonObject1.getString("data"));
    var page_data = new JSONObject(data.getString("page"));
    var comic_list = new JSONArray(page_data.getString("comic_list"));
    for (var i = 0; i <comic_list.length(); i ++) {
        var json = comic_list.getJSONObject(i);
        var cid = json.getString("comic_id");
        var title = json.getString("comic_name");
        var cover = format_image(cid);
        var author = json.getString("comic_feature");
        list.add(new Comic(sort, cid, title, cover, null, author));
    }


    return list;

}


//格式化图片
function format_image (bookId) {
    var sb = bookId;
    var i = 0;
    var count = bookId.split("");
    while (i < 9-count.length){
        sb = '0'+sb;
        i ++;
    }
    Log.d("参数", sb);
    var chars = sb.split('');
    var url = ''
    for (var i = 0; i < chars.length; i++) {
        url += chars[i];
        if (i == 2 || i == 5){
            url += "/"
        }
    }
    return "http://image.zymkcdn.com/file/cover/" + url + ".jpg-300x400.webp";

}

