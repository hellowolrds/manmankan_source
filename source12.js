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
var title = "飞漫画";
// 类型，相当于java中TYPE
var sort = 12;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "https://m.feimh8.com/api/getsortlist/?page=" + page + "&comic_sort=&orderby=click&search_key=" + keyword + "&size=48";
    return new Request.Builder()
            .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19")
            .url(url)
            .build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var jsonObject = new JSONObject(content);
    var jsonObject1 = new JSONObject(jsonObject.getString("data"));
    var chapterList = new JSONArray(jsonObject1.getString("data"));
    var list = new ArrayList();
    for (var i = 0; i <chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("comic_newid");
        var title = json.getString("comic_name");
        var cover = "http://cover.feimh8.com/mh/"+ json.getString("comic_id") +".jpg-300x400.jpg";
        var update = json.getString("last_chapter_name");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }

    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
     var url = StringUtils.format("https://m.feimh8.com/%s/", cid);
     return new Request.Builder()
         .addHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1")
         .url(url)
         .build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".header-title");
    var cover = body.attr(".comic-cover img", "data-src");
    cover = "http:" + cover;
    var update = body.text(".comic-update-time");
    var intro = body.text("#js_desc_content");
    var author = "未知";
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#js_chapter_list > li");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text(".name");
        var path = node.attr("a", "href");
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
     var url = "https://m.feimh8.com"+path;
     return new Request.Builder()
         .addHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1")
         .url(url)
         .build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.ccmh6.com/");
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
   var comic = StringUtils.match("current_chapter:(.*),prev", content, 1);
   Log.d("图片内容", "parseImages: "+comic);
   var jsonObject = new JSONObject(comic);
   var start_num = jsonObject.getInt("start_num");
   var end_num = jsonObject.getInt("end_num");
   var format = jsonObject.getString("rule");
   var base_url = jsonObject.getString("chapter_domain");

   for (var i = 1; i <= end_num; i ++) {
       var url = "https://"+base_url+"/"+format.replace("$$", i+"")+"-kmh.low.webp";
       Log.d("图片内容", "parseImages: "+base_url);
       list.add(new ImageUrl(i, url, false));
   }

    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("热血", "rexue"));
   list.add(Pair.create("机战", "jizhan"));
   list.add(Pair.create("运动", "yundong"));
   list.add(Pair.create("推理", "tuili"));
   list.add(Pair.create("冒险", "maoxian"));
   list.add(Pair.create("百合", "baihe"));
   list.add(Pair.create("搞笑", "gaoxiao"));
   list.add(Pair.create("战争", "zhanzhen"));
   list.add(Pair.create("神魔", "shenmo"));
   list.add(Pair.create("忍者", "renzhe"));
   list.add(Pair.create("竞技", "jingji"));
   list.add(Pair.create("悬疑", "xuanyi"));
   list.add(Pair.create("社会", "shehui"));
   list.add(Pair.create("恋爱", "lianai"));
   list.add(Pair.create("宠物", "chongwu"));
   list.add(Pair.create("吸血", "xixue"));
   list.add(Pair.create("萝莉", "luoli"));
   list.add(Pair.create("后宫", "hougong"));
   list.add(Pair.create("御姐", "yujie"));
   list.add(Pair.create("霸总", "bazong"));
   list.add(Pair.create("玄幻", "xuanhuan"));
   list.add(Pair.create("古风", "gufeng"));
   list.add(Pair.create("历史", "lishi"));
   list.add(Pair.create("漫改", "mangai"));
   list.add(Pair.create("游戏", "youxi"));
   list.add(Pair.create("穿越", "chuanyue"));
   list.add(Pair.create("恐怖", "kongbu"));
   list.add(Pair.create("真人", "zhenren"));
   list.add(Pair.create("科幻", "kehuan"));
   list.add(Pair.create("都市", "dushi"));
   list.add(Pair.create("武侠", "wuxia"));
   list.add(Pair.create("修真", "xiuzhen"));
   list.add(Pair.create("生活", "shenghuo"));
   list.add(Pair.create("动作", "dongzuo"));
   list.add(Pair.create("防疫", "fangyi"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://m.feimh8.com/api/getsortlist/?page="+ page +"&comic_sort=" + format + "&type=4&size=48";
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
   var jsonObject = new JSONObject(content);
   var jsonObject1 = new JSONObject(jsonObject.getString("data"));
   var chapterList = new JSONArray(jsonObject1.getString("data"));
   var list = new ArrayList();
   for (var i = 0; i <chapterList.length(); i ++) {
       var json = chapterList.getJSONObject(i);
       var cid = json.getString("comic_newid");
       var title = json.getString("comic_name");
       var cover = "http://cover.feimh8.com/mh/"+ json.getString("comic_id") +".jpg-300x400.jpg";
       var update = json.getString("last_chapter_name");
       var author = json.getString("comic_author");
       list.add(new Comic(sort, cid, title, cover, update, author));
   }

   return list;
}