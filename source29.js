// 导入需要依赖的类
importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
// 导入依赖包
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
var title = "漫画羊";
// 类型, 类型必须是唯一的，不然会导入失败
var sort = 29;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "https://m.manhuayang.com/api/getsortlist/?page="+page+"&comic_sort=&orderby=click&search_key="+keyword+"&size=48";
    return new Request.Builder()
        .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    Log.d("内容", content);
    eval("var data1 = "+content+";");
    var list = new ArrayList();
    var arr = data1.data.data;
    for (var i = 0; i <arr.length; i ++) {
        var json = arr[i];
        var cid = json.comic_newid+"_"+json.comic_id;
        var title = json.comic_name;
//        Log.d("标题", title);
        var cover = "http://cover.feimh8.com/mh/"+cid+".jpg-300x400.jpg";
        var update = json.last_chapter_name;
        var author = json.comic_author;

        list.add(new Comic(sort, cid, title, cover, null, author));
    }
    return list;
}
// 详情请求头
function getInfoRequest(cid) {
    var temp = cid.split("_");
    var url = "https://m.manhuayang.com/"+temp[0]+"/";
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
}
// 解析详情
function parseInfo() {
    //    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".comic-detail h1");
    var cover = body.attr(".comic-cover img", "data-src");
    var update = body.text("#js_read_catalog .update-time");
    var author = "";
    var intro = body.text("#js_desc_content");
    var status = false;

    var comic = new Comic(sort, "");

    comic.setInfo(title, cover, update, intro, author, status);

    return comic;
}


// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#js_chapter_list li");
    var list = new ArrayList();

    for (var i = 0; i < chapterList.size(); i ++) {
        var node = chapterList.get(i);
        var title = node.text(".chapter-name .name");
        var path = node.attr("a", "href");
        list.add(new Chapter(title, path));
    }

    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "https://m.manhuayang.com" + path;
    Log.d("地址", url);
    return new Request.Builder()
    .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
    .url(url).build();
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
    var image_str = StringUtils.match("comicInfo=(.+)\\}\\}", content, 1);
    Log.d("图片字符串", image_str);
    eval("var data = "+image_str+"}}");
//    Log.d("代码", data);
    var base_url = "https://"+data.current_chapter.chapter_domain;
    var count = data.current_chapter.end_num;
    var img_url = base_url + data.current_chapter.rule + "-asmh.low.webp";
    for (var i = 0; i < count; i ++) {
        var url = img_url.replace("$$", i+1);
        list.add(new ImageUrl(i+1, url, false));
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
    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = "https://m.manhuayang.com/api/getsortlist/?page="+page+"&comic_sort="+format+"&type=4&size=48";
    return new Request.Builder().url(url).build();
}

//解析推荐
function parseCategory() {
    eval("var data1 = "+content+";");
    var list = new ArrayList();
    var arr = data1.data.data;
    for (var i = 0; i <arr.length; i ++) {
        var json = arr[i];
        var cid = json.comic_newid+"_"+json.comic_id;
        var title = json.comic_name;
//        Log.d("标题", title);
        var cover = "http://cover.feimh8.com/mh/"+cid+".jpg-300x400.jpg";
        var update = json.last_chapter_name;
        var author = json.comic_author;

        list.add(new Comic(sort, cid, title, cover, null, author));
    }
    return list;
}
