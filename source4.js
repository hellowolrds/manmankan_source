importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importClass(Packages.okhttp3.Request)
importClass(Packages.okhttp3.Headers)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.utils.DecryptionUtils)
importClass(Packages.com.reader.comic.soup.Node)

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "极速漫画";
// 类型，相当于java中TYPE
var sort = 4;


//第一个方法返回搜索请求函数
function getSearchRequest (keyword, page) {
    var url = "http://www.js518.net/statics/search.aspx?key="+ keyword +"&page=" + page;
    Log.d("请求头", url);

    return new Request.Builder()
            .url(url)
            .build();
}
// 解析搜索页面
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".mh-search-list > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".mh-works-title h4");
        var cover = node.attr(".mh-nlook-w img", "src");
        var update = node.text(".mh-works-author");
        list.add(new Comic(sort, cid, title, cover, update, null));
    }


    return list;

}

//请求漫画详情
function getInfoRequest(cid) {
    cid = cid.replace(/_/g, "/");
    var url = "http://www.js518.net/".concat(cid);
    Log.d("测试", "getImagesRequest: "+url);
    return new Request.Builder()
//                .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 7.0;) Chrome/58.0.3029.110 Mobile")
            .url(url)
            .build();
}
//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text(".mh-date-info .mh-date-info-name h4");
    var cover = body.src(".mh-date-bgpic img");
    var update = "";
    var author = body.text(".mh-pdt30 .one em");
    var intro = body.text("#workint");
    var status = false;
//    Log.d("测试", "parseInfo: "+intro);
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
        var title = node.text();
        var path = node.attr("a", "href");
        list.add(new Chapter(title, path));
    }
    return list;
}
// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = "http://www.js518.net/" + path;
    return new Request.Builder()
                .url(url)
                .build();
}

// 图片请求头： 必须要有
function getHeader () {
    return Headers.of("Referer", "http://m.tuku.cc");
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
    var base_url = "http://j.aiwenwo.net/";
    var data = StringUtils.match("qTcms_S_m_murl_e=\\\"(.+)\\\";", content, 1);

    var image_urls = DecryptionUtils.base64Decrypt(data);
    var temp = image_urls.split("\\$qingtiandy\\$");
    for (var i = 0; i < temp.length; i ++) {
        var url = temp[i];
        list.add(new ImageUrl(i+1, base_url+url,false));
        i++;
    }

    return list;
}
// 获取分类
function get_subject () {
    var url = "http://www.js518.net/%s/%%s.html";
    var list = new ArrayList();
    list.add(Pair.create("全部", StringUtils.format(url, "all")));
    list.add(Pair.create("热血", StringUtils.format(url, "rexueshaonian")));
    list.add(Pair.create("格斗", StringUtils.format(url, "wuxiagedou")));
    list.add(Pair.create("科幻", StringUtils.format(url, "kehuanmohuan")));
    list.add(Pair.create("竞技", StringUtils.format(url, "jingjitiyu")));
    list.add(Pair.create("搞笑", StringUtils.format(url, "gaoxiaomanhua")));
    list.add(Pair.create("推理", StringUtils.format(url, "tuilizhentan")));
    list.add(Pair.create("恐怖", StringUtils.format(url, "kongbulingyi")));
    list.add(Pair.create("耽美", StringUtils.format(url, "danmeih")));
    list.add(Pair.create("少女", StringUtils.format(url, "shaonvmanhua")));
    list.add(Pair.create("恋爱", StringUtils.format(url, "lianaishenghuo")));
    list.add(Pair.create("生活", StringUtils.format(url, "shenghuomanhua")));
    list.add(Pair.create("战争", StringUtils.format(url, "zhanzhengmanhua")));
    list.add(Pair.create("故事", StringUtils.format(url, "gushimanhua")));
    list.add(Pair.create("冒险", StringUtils.format(url, "mxmh")));
    list.add(Pair.create("魔幻", StringUtils.format(url, "mohuanmanhua")));
    list.add(Pair.create("玄幻", StringUtils.format(url, "xuanhuanmanhua")));
    list.add(Pair.create("校园", StringUtils.format(url, "xiaoyuanmanhua")));
    list.add(Pair.create("悬疑", StringUtils.format(url, "xuanyimanhua")));
    list.add(Pair.create("萌系", StringUtils.format(url, "mengximanhua")));
    list.add(Pair.create("穿越", StringUtils.format(url, "chuanyuemanhua")));
    list.add(Pair.create("后宫", StringUtils.format(url, "hougongmanhua")));
    list.add(Pair.create("都市", StringUtils.format(url, "dushimanhua")));
    list.add(Pair.create("武侠", StringUtils.format(url, "wuxiamanhua")));
    list.add(Pair.create("历史", StringUtils.format(url, "lishimanhua")));
    list.add(Pair.create("同人", StringUtils.format(url, "tongrenmanhua")));
    list.add(Pair.create("励志", StringUtils.format(url, "lizhimanhua")));
    list.add(Pair.create("治愈", StringUtils.format(url, "zhiyumanhua")));
    list.add(Pair.create("机甲", StringUtils.format(url, "jijiamanhua")));
    list.add(Pair.create("纯爱", StringUtils.format(url, "chunaimanhua")));
    list.add(Pair.create("美食", StringUtils.format(url, "meishimanhua")));
    list.add(Pair.create("恶搞", StringUtils.format(url, "egaomanhua")));
    list.add(Pair.create("虐心", StringUtils.format(url, "nuexinmanhua")));
    list.add(Pair.create("动作", StringUtils.format(url, "dongzuomanhua")));
    list.add(Pair.create("惊险", StringUtils.format(url, "jingxianmanhua")));
    list.add(Pair.create("唯美", StringUtils.format(url, "weimeimanhua")));
    list.add(Pair.create("震撼", StringUtils.format(url, "zhenhanmanhua")));
    list.add(Pair.create("复仇", StringUtils.format(url, "fuchoumanhua")));
    list.add(Pair.create("侦探", StringUtils.format(url, "zhentanmanhua")));
    list.add(Pair.create("脑洞", StringUtils.format(url, "naodongmanhua")));
    list.add(Pair.create("奇幻", StringUtils.format(url, "qihuanmanhua")));
    list.add(Pair.create("宫斗", StringUtils.format(url, "gongdoumanhua")));
    list.add(Pair.create("爆笑", StringUtils.format(url, "baoxiaomanhua")));
    list.add(Pair.create("运动", StringUtils.format(url, "yundongmanhua")));
    list.add(Pair.create("青春", StringUtils.format(url, "qingchunmanhua")));
    list.add(Pair.create("灵异", StringUtils.format(url, "lingyimanhua")));
    list.add(Pair.create("古风", StringUtils.format(url, "gufengmanhua")));
    list.add(Pair.create("权谋", StringUtils.format(url, "quanmoumanhua")));
    list.add(Pair.create("节操", StringUtils.format(url, "jiecaomanhua")));
    list.add(Pair.create("明星", StringUtils.format(url, "mingxingmanhua")));
    list.add(Pair.create("暗黑", StringUtils.format(url, "anheimanhua")));
    list.add(Pair.create("社会", StringUtils.format(url, "shehuimanhua")));
    list.add(Pair.create("浪漫", StringUtils.format(url, "langmanmanhua")));
    list.add(Pair.create("仙侠", StringUtils.format(url, "xianxiamanhua")));
    return list;
}


// 请求漫画展示详情
function getCategoryRequest(format, page) {
    var url = StringUtils.format(format, page);
    Log.d("分类接口", url);
    return new Request.Builder()
        .url(url).build();
}




//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list(".mh-search-list li");

    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr("a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".mh-works-title h4");
        var cover = node.attr(".mh-nlook-w img", "src");
        var author = node.text(".mh-works-tags em");
        var update = node.text(".mh-works-author");
       list.add(new Comic(sort, cid, title, cover, update, author));
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

