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
importClass(Packages.com.reader.comic.utils.StringUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "动漫之家";
// 类型，相当于java中TYPE
var sort = 2;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "";
    if (page == 1) {
        url = "http://s.acg.dmzj.com/comicsum/search.php?s="+keyword;
    }
    return new Request.Builder().url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    eval(content);
    var list = new ArrayList();
    for (var i = 0; i < g_search_data.length; i ++) {
        var object1 = g_search_data[i];
        var cid = object1.id;
        var title = object1.comic_name;
        var cover = object1.comic_cover;
        var author = object1.comic_author;
        list.add(new Comic(sort, cid, title, cover, null, author));
    }
    return list;
}
// 详情请求头
function getInfoRequest(cid) {
    var url = "http://v2.api.dmzj.com/comic/"+ cid +".json";
    return new Request.Builder().url(url).build();
}
// 解析详情
function parseInfo() {
    var object = new JSONObject(content);
    var title = object.getString("title");
    var cover = object.getString("cover");
    var time = object.has("last_updatetime") ? object.getLong("last_updatetime") * 1000 : null;
    var update = time == null ? null : StringUtils.getFormatTime("yyyy-MM-dd", time);
    var intro = object.optString("description");
    var sb = new StringBuilder();
    var array = object.getJSONArray("authors");
    for (var i = 0; i < array.length(); ++i) {
       sb.append(array.getJSONObject(i).getString("tag_name")).append(" ");
    }
    var author = sb.toString();
    var status = object.getJSONArray("status").getJSONObject(0).getInt("tag_id") == 2310;

    var comic = new Comic(sort, "");

    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}


// 解析章节
function parseChapter () {
    var list = new ArrayList();
    var object = new JSONObject(content);
    var array = object.getJSONArray("chapters");
    for (var i = 0; i != array.length(); ++i) {
        var data = array.getJSONObject(i).getJSONArray("data");
        for (var j = 0; j != data.length(); ++j) {
            var chapter = data.getJSONObject(j);
            var title = chapter.getString("chapter_title");
            var path = chapter.getString("chapter_id");
            list.add(new Chapter(title, path));
        }
    }

   return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("http://v2.api.dmzj.com/chapter/%s/%s.json", cid, path);
    return new Request.Builder().url(url).build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://m.dmzj.com/");
}
function getHeader2(url) {
    return getHeader();
}
function getHeader3 () {
    return getHeader ();
}

// 解析图片
function parseImages() {
    var list = new ArrayList();
    var object = new JSONObject(content);
    var array = object.getJSONArray("page_url");
    for (var i = 0; i < array.length(); i++) {
        Log.d("图片地址", array.getString(i));
        list.add(new ImageUrl(i + 1, array.getString(i), false));
    }
    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    var url = "http://m.dmzj.com/classify/%s-0-0-0-0-%%s.json";
    list.add(Pair.create("全部", StringUtils.format(url, "0")));
    list.add(Pair.create("冒险", StringUtils.format(url, "1")));
    list.add(Pair.create("欢乐向", StringUtils.format(url, "2")));
    list.add(Pair.create("格斗", StringUtils.format(url, "3")));
    list.add(Pair.create("科幻", StringUtils.format(url, "4")));
    list.add(Pair.create("爱情", StringUtils.format(url, "5")));
    list.add(Pair.create("竞技", StringUtils.format(url, "6")));
    list.add(Pair.create("魔法", StringUtils.format(url, "7")));
    list.add(Pair.create("校园", StringUtils.format(url, "8")));
    list.add(Pair.create("悬疑", StringUtils.format(url, "9")));
    list.add(Pair.create("恐怖", StringUtils.format(url, "10")));
    list.add(Pair.create("生活亲情", StringUtils.format(url, "11")));
    list.add(Pair.create("百合", StringUtils.format(url, "12")));
    list.add(Pair.create("伪娘", StringUtils.format(url, "13")));
    list.add(Pair.create("耽美", StringUtils.format(url, "14")));
    list.add(Pair.create("后宫", StringUtils.format(url, "15")));
    list.add(Pair.create("萌系", StringUtils.format(url, "16")));
    list.add(Pair.create("治愈", StringUtils.format(url, "17")));
    list.add(Pair.create("武侠", StringUtils.format(url, "18")));
    list.add(Pair.create("职场", StringUtils.format(url, "19")));
    list.add(Pair.create("奇幻", StringUtils.format(url, "20")));
    list.add(Pair.create("节操", StringUtils.format(url, "21")));
    list.add(Pair.create("轻小说", StringUtils.format(url, "22")));
    list.add(Pair.create("搞笑", StringUtils.format(url, "23")));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = StringUtils.format(format, page);
    return new Request.Builder().url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var array = new JSONArray(content);
    Log.d("网页", content);
    for (var i = 0; i != array.length(); i++) {
        var object = array.getJSONObject(i);
//        Log.d("分类地址", "http://images.dmzj.com/".concat(object.getString("cover")));
        if (object.optInt("hidden", 1) != 1) {
            var cid = object.getString("id");
            var title = object.getString("name");
            var cover = "https://images.dmzj.com/".concat(object.getString("cover"));

            var time = object.has("last_updatetime") ? object.getLong("last_updatetime") * 1000 : null;
            var update = time == null ? null : StringUtils.getFormatTime("yyyy-MM-dd", time);
            var author = object.optString("authors");
            list.add(new Comic(sort, cid, title, cover, update, author));
        }
    }
    return list;
}








