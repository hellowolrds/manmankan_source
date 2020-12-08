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
importClass(Packages.java.net.URLEncoder)
importClass(Packages.com.reader.comic.utils.DecryptionUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "漫画台";
// 类型，相当于java中TYPE
var sort = 18;
var baseUrl = "https://m.manhuatai.com";

// 请求头
function getSearchRequest (keyword, page) {
     var url = StringUtils.format(baseUrl + "/api/getsortlist/?product_id=2&productname=mht&platformname=wap&orderby=click&search_key=%s&page=%s&size=48",
        URLEncoder.encode(keyword, "UTF-8"), page+"");
     return new Request.Builder().url(url).build();
}

// 解析搜索页面
function getSearchIterator() {
    var jsonObject = new JSONObject(content);
    var jsonObject1 = new JSONObject(jsonObject.getString("data"));
    var chapterList = new JSONArray(jsonObject1.getString("data"));
    var list = new ArrayList();
    for (var i = 0; i <chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("comic_newid");
        var title = json.getString("comic_name");
        var cover = "https://image.yqmh.com/mh/" + json.getString("comic_id") + ".jpg-300x400.webp";
        var update = null;
        var author = null;

        list.add(new Comic(sort, cid, title, cover, update, author));
    }

    return list;

}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://www.manhuatai.com/".concat(cid) + "/";
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.attr("h1#detail-title", "title");
    var cover = body.attr("div.detail-cover > img", "data-src");
    cover = "https:" + cover;
    var update = body.text("span.update").substring(0,10);
    var intro = body.text("div#js_comciDesc > p.desc-content");
    var author = null;
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("ol#j_chapter_list > li > a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.attr( "title");
        var path = node.hrefWithSplit(1);
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("https://m.manhuatai.com/api/getcomicinfo_body?product_id=2&productname=mht&platformname=wap&comic_newid=%s", cid);
    return new Request.Builder().url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "https://www.manhuadb.com");
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

    var temp = new JSONObject(content);
    if (temp.getInt("status") != 0) {
        return list;
    }
    var chapters = temp.getJSONObject("data").getJSONArray("comic_chapter");
    var chapter = null;
    for (var i = 0; i < chapters.length(); i++) {
        chapter = chapters.getJSONObject(i);
        var a = chapter.getString("chapter_id");
        if(a.equals(path)) {
            break;
        }
    }

    var ImagePattern = "http://mhpic." + chapter.getString("chapter_domain") + chapter.getString("rule") + "-mht.low.webp";

    for (var index = chapter.getInt("start_num"); index <= chapter.getInt("end_num"); index++) {
        var image = ImagePattern.replace("$$", Integer.toString(index));
        list.add(new ImageUrl(index, image, false));
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
    list.add(Pair.create("耽美", "liaomei"));
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
   var url = "https://m.manhuatai.com/api/getsortlist/?product_id=2&productname=mht&platformname=wap&page=" + page + "&pageSize=48&comic_sort="+ format +"&size=48";
   Log.d("内容", url);
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    Log.d("内容", content);
    var jsonObject = new JSONObject(content);
    var jsonObject1 = new JSONObject(jsonObject.getString("data"));
    var chapterList = new JSONArray(jsonObject1.getString("data"));
    var list = new ArrayList();
    for (var i = 0; i <chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("comic_newid");
        var title = json.getString("comic_name");
        var cover = "https://image.yqmh.com/mh/" + json.getString("comic_id") + ".jpg-300x400.webp";
        var update = json.getString("last_chapter_name");
        var author = json.getString("comic_author");

        list.add(new Comic(sort, cid, title, cover, update, author));
    }

    return list;
}