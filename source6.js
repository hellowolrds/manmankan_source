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
importClass(Packages.com.reader.comic.utils.DecryptionUtils)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "动漫屋";
// 类型，相当于java中TYPE
var sort = 6;

//第一个方法返回搜索请求函数
function getSearchRequest (keyword, page) {
    var url = "http://m.dm5.com/pagerdata.ashx";
    var body = new FormBody.Builder()
            .add("t", "7")
            .add("pageindex", page+"")
            .add("title", keyword)
            .build();
    return new Request.Builder().url(url).post(body).addHeader("Referer", "http://m.dm5.com").build();
}

// 解析搜索页面
function getSearchIterator() {
    var chapterList = new JSONArray(content);
    var list = new ArrayList();
    Log.d("打印", chapterList.length());
    for (var i = 0; i < chapterList.length(); i ++) {
        var json = chapterList.getJSONObject(i);
        var cid = json.getString("Url").split("/")[1];
        var title = json.getString("Title");
        var cover = json.getString("Pic");
        var update = json.getString("LastPartTime");
        var array = json.optJSONArray("Author");
        var author = "";
        for (var j = 0; array != null && j != array.length(); ++j) {
            author = author.concat(array.optString(i));
        }
//        Log.d("打印", title+"---"+cover+"---"+update+"---"+author)
        list.add(new Comic(sort, cid, title, cover, null, author));
    }

    return list;

}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "http://www.dm5.com/".concat(cid);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
    var body = new Node(content);
    var title = body.text(".banner_detail_form .info .title");
    var cover = body.attr("div.banner_detail_form > div.cover > img", "src");
    var update = "";
    var author = body.text("div.banner_detail_form > div.info > p.subtitle > a");
    var intro = body.text("div.banner_detail_form > div.info > p.content");
    var status = false;

    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}


function parseChapter () {
   var body = new Node(content);

   var chapterList = body.list("#chapterlistload > ul  li > a");
   var list = new ArrayList();

   for (var i = 0; i < chapterList.size(); i ++) {
       var node = chapterList.get(i);
       var title = StringUtils.split(node.text(), " ", 0);
       var path = node.hrefWithSplit(0);
       list.add(new Chapter(title, path));
   }

   return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://m.dm5.com/" + path;
    return new Request.Builder()
                .url(url)
                .addHeader("Referer", StringUtils.format("http://m.dm5.com/%s", path))
                .build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://m.dm5.com/");
}
function getHeader2 (url) {
    var cid = "m".concat(StringUtils.match("cid=(\\d+)", url, 1));
    return Headers.of("Referer", "http://m.dm5.com/".concat(cid));
}
function getHeader3 () {
    var cid = "";
//    Log.d("测试头", list);
    if (list != null) {
        cid = list.get(0).getChapter();
    }
    return Headers.of("Referer", "http://m.dm5.com/".concat(cid));
}

// 解析图片
function parseImages() {
    var list = new ArrayList();
    var str = StringUtils.match("eval\\(.*\\)", content, 0);
    if (str != null) {
        str = DecryptionUtils.evalDecrypt(str, "newImgs");
        var array = str.split(",");
        for (var i = 0; i != array.length; ++i) {
            list.add(new ImageUrl(i + 1, array[i], false));
        }
    }
    return list;
}


function get_subject() {
    var list = new ArrayList();
    list.add(Pair.create("全部", "tag0"));
    list.add(Pair.create("热血", "tag31"));
    list.add(Pair.create("恋爱", "tag26"));
    list.add(Pair.create("校园", "tag1"));
    list.add(Pair.create("百合", "tag3"));
    list.add(Pair.create("耽美", "tag27"));
    list.add(Pair.create("冒险", "tag2"));
    list.add(Pair.create("后宫", "tag8"));
    list.add(Pair.create("科幻", "tag25"));
    list.add(Pair.create("战争", "tag12"));
    list.add(Pair.create("悬疑", "tag17"));
    list.add(Pair.create("推理", "tag33"));
    list.add(Pair.create("搞笑", "tag37"));
    list.add(Pair.create("奇幻", "tag14"));
    list.add(Pair.create("魔法", "tag15"));
    list.add(Pair.create("恐怖", "tag29"));
    list.add(Pair.create("神鬼", "tag20"));
    list.add(Pair.create("历史", "tag4"));
    list.add(Pair.create("同人", "tag30"));
    list.add(Pair.create("运动", "tag34"));
    list.add(Pair.create("绅士", "tag36"));
    list.add(Pair.create("机战", "tag40"));
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var args = format.split(" ");
   var url = "http://www.dm5.com/dm5.ashx?t="+Date.parse(new Date());
   var body = new FormBody.Builder()
           .add("pagesize","68")
           .add("pageindex", page+"")
           .add("tagid", format.replace("tag", ""))
           .add("areaid", "0")
           .add("status", "0")
           .add("usergroup", "0")
           .add("pay", args[0])
           .add("data[group_id]", "-1")
           .add("char", "")
           .add("sort", "10")
           .add("action", "getclasscomics")
           .build();
   return new Request.Builder().url(url).post(body).addHeader("Referer", "http://www.u17.com").build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var jsonObject1 = new JSONObject(content);
    var comic_list = new JSONArray(jsonObject1.getString("UpdateComicItems"));

    for (var i = 0; i <comic_list.length(); i ++) {
        var json = comic_list.getJSONObject(i);
        var cid = json.getString("UrlKey");
        var title = json.getString("Content");
        var cover = json.getString("ShowConver");
        var update= json.getString("LastUpdateTime");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }


    return list;

}



function isFinish (str) {
    return str.indexOf("完结") != -1 ? true : false;
}