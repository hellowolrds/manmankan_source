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
var title = "two comic";
// 类型，相当于java中TYPE
var sort = 31;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "https://x.twocomic.com/search/result/?k="+keyword+"&page="+page;
          return new Request.Builder()
          .addHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
          .url(url)
          .build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("a", -1);
        var title = node.text("h2");
        var cover = node.attr(".swiper-lazy", "data-background");
        cover = "https://x.twocomic.com" + cover;
        var update = node.text("a b:last-child");

        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = "https://x.twocomic.com/comic/"+ cid +"/";
    return new Request.Builder()
        .addHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.text("h1");
    var cover = body.src("#swipercomic .item-info .left .swiper-lazy");
    cover = "https://x.twocomic.com" + cover;
    var update = body.text("#swipercomic .item-info .center ul li:last-child");
    update = update.replace("更新：", "");
    var intro = body.text(".bottom #info");
    var author = body.text("#swipercomic .item-info .center ul li:first-child");
    author = author.replace("作者：", "");
    Log.d("详情", title+"---"+cover+"---"+update+"---"+intro+"---"+author);
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("#comiclist0 ul a");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.text();
        var path = node.href();
        list.add(new Chapter(title, path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    path = path.replace("s/", "_");
    path = path.replace("/?", ".html/?");
    var url = "https://www.twocomic.com/view" + path;
    Log.d("请求path", url);
    return new Request.Builder()
            .addHeader("Host", "twocomic.com")
            .addHeader("Cookie", "RI=0")
            .addHeader("Cache-Control", "no-cache")
            .addHeader("Connection", "keep-alive")
            .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")
            .url(url)
            .build();
}

function getHeader () {
    return Headers.of("Referer", "http://images.dmzj.com/");
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

    var img_str = StringUtils.match("var ti(.+)eval", content, 1);
    img_str = "var ti"+img_str+"";
//    Log.d("电子化", img_str);
    eval(img_str);
    var ch = path.split("=")[1];

    var f = 50;
    var p = 1;
    var c = sp(cs, f, ch, 1);

    var count = ss(c, 7, 3);
//    Log.d("测试", si(c, 1, ti, f));
    for (var i = 1; i <= count; i++) {
        var url = si(c, i, ti, f);
        Log.d("图片地址", url);
        list.add(new ImageUrl(i, url, false));
    }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("武鬥類", "cat24"));
    list.add(Pair.create("刀劍類", "cat4"));
    list.add(Pair.create("熱血類", "cat58"));
    list.add(Pair.create("妖魔類", "cat8"));
    list.add(Pair.create("戰國類", "cat65"));
    list.add(Pair.create("冒險類", "cat6"));
    list.add(Pair.create("血腥類", "cat62"));
    list.add(Pair.create("其他競技", "cat41"));
    list.add(Pair.create("足球類", "cat33"));
    list.add(Pair.create("籃球類", "cat34"));
    list.add(Pair.create("棒球類", "cat35"));
    list.add(Pair.create("網球類", "cat36"));
    list.add(Pair.create("搏擊類", "cat37"));
    list.add(Pair.create("棋牌類", "cat38"));
    list.add(Pair.create("賽車類", "cat39"));
    list.add(Pair.create("亨飪類", "cat16"));
    list.add(Pair.create("體操類", "cat313"));
    list.add(Pair.create("排球類", "cat315"));
    list.add(Pair.create("其他競技", "cat385"));
    list.add(Pair.create("少女幻想類", "cat15"));
    list.add(Pair.create("校園戀愛類", "cat14"));
    list.add(Pair.create("少女職業類", "cat42"));
    list.add(Pair.create("成人戀愛類", "cat43"));
    list.add(Pair.create("少女其他類", "cat44"));
    list.add(Pair.create("魔法少女類", "cat66"));
    list.add(Pair.create("同性戀愛類", "cat70"));
    list.add(Pair.create("BoyLove類", "cat69"));
    list.add(Pair.create("生活親情類", "cat307"));
    list.add(Pair.create("性別轉換類", "cat309"));
    list.add(Pair.create("百合類", "cat312"));
    list.add(Pair.create("勵志", "cat404"));
    list.add(Pair.create("魔幻少女類", "cat405"));
    list.add(Pair.create("同窗類", "cat46"));
    list.add(Pair.create("校園類", "cat59"));
    list.add(Pair.create("超能類", "cat57"));
    list.add(Pair.create("超時代類", "cat63"));
    list.add(Pair.create("歷險類", "cat67"));
    list.add(Pair.create("生活類", "cat45"));
    list.add(Pair.create("勁爆類", "cat61"));
    list.add(Pair.create("偽娘類", "cat308"));
    list.add(Pair.create("懸疑類", "cat392"));
    list.add(Pair.create("後宮類", "cat394"));
    list.add(Pair.create("奇幻類", "cat395"));
    list.add(Pair.create("運動類", "cat396"));
    list.add(Pair.create("美食類", "cat397"));
    list.add(Pair.create("治愈類", "cat400"));
    list.add(Pair.create("節操類", "cat401"));
    list.add(Pair.create("音樂舞蹈", "cat402"));
    list.add(Pair.create("愛情類", "cat403"));
    list.add(Pair.create("BoyLove類", "cat406"));
    list.add(Pair.create("童真類", "cat47"));
    list.add(Pair.create("爆笑類", "cat48"));
    list.add(Pair.create("惡搞類", "cat49"));
    list.add(Pair.create("動物類", "cat64"));
    list.add(Pair.create("偵探類", "cat5"));
    list.add(Pair.create("警察類", "cat51"));
    list.add(Pair.create("醫生類", "cat52"));
    list.add(Pair.create("其他職業", "cat53"));
    list.add(Pair.create("槍擊類", "cat27"));
    list.add(Pair.create("機械類", "cat7"));
    list.add(Pair.create("戰爭類", "cat17"));
    list.add(Pair.create("改造人類", "cat25"));
    list.add(Pair.create("科幻類", "cat393"));
    list.add(Pair.create("港產類", "cat9"));
    list.add(Pair.create("恐怖類", "cat19"));
    list.add(Pair.create("短篇類", "cat18"));
    list.add(Pair.create("未分類", "cat54"));

    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://x.twocomic.com/cats/" + format + "/" + page + ".html";
   url = StringUtils.format(url, page+"");
   return new Request.Builder()
        .addHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list("li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("a", -1);
        var title = node.text("h2");
        var cover = node.attr(".swiper-lazy", "data-background");
        cover = "https://x.twocomic.com" + cover;
        var update = node.text("a b:last-child");

        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

// 工具函数
function sp(cs, f, ch, p) {
    var cc = cs.length;
    var c = "";
    for (var i = 0; i < cc / f; i++) {
        if (ss(cs, i * f, 4) == ch) {
            c = ss(cs, i * f, f, f);
            ci = i;
            break;
        }
    }
    if (c == '') {
        c = ss(cs, cc - f, f);
        // ch = chs;
    }
    return c;
}

function ss(a, b, c, d) {
    var e = a.substring(b, b + c);
    return d == null ? e.replace(/[a-z]*/gi, "") : e;
}

function si(c, p, ti, f) {
    return 'https://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(p) + '_' + ss(c, mm(p) + 10, 3, f) + '.jpg';
}
function nn(n) {
    return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
}
function mm(p) {
    return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
}