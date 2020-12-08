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
var title = "漫画160";
// 类型，相当于java中TYPE
var sort = 9;
var baseUrl = "https://www.mh160.xyz";
// 请求头
function getSearchRequest (keyword, page) {
   if (page == 1) {
         var url = StringUtils.format("https://www.mh160.xyz/statics/search.aspx?key=%s", keyword);
         return new Request.Builder()
                .addHeader("Referer", "https://www.mh160.xyz")
                .addHeader("Host","www.mh160.xyz")
                .url(url)
                .build();
    }
    return null;
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list(".mh-search-result > ul > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(".mh-works-info > a", 1);
        var title = node.text("h4").trim();
        var cover = node.attr("img", "src");
        var update = node.text(".mh-up-time.fr").replace("最后更新时间：","");

        list.add(new Comic(sort, cid, title, cover, update, null));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = baseUrl + "/kanmanhua/"+cid;
    return new Request.Builder()
        .url(url)
        .addHeader("Referer", baseUrl)
        .addHeader("Host","www.mh160.xyz")
        .build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var title = body.attr(".mh-date-bgpic > a > img", "title");
    var cover = body.src(".mh-date-bgpic > a > img");
    var update = body.text("div.cy_zhangjie_top > :eq(2) > font");
    var intro = body.text("#workint > p");
    var author = body.text("span.one > em");
    var status = body.text("p.works-info-tc > span:eq(3)").indexOf("完结") > -1 ? true : false;
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
        var title = node.text('a');
        var path = node.href('a');
        list.add(new Chapter(title, path));
    }

    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = baseUrl + path;
    return new Request.Builder()
           .url(url)
           .addHeader("Referer", baseUrl)
           .addHeader("Host","www.mh160.xyz")
           .build();
}

function getHeader () {
    return Headers.of("Referer", "https://www.mh160.xyz/");
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

    var str = StringUtils.match("qTcms_S_m_murl_e=\"(.*?)\"", content, 1);
    var str_id = StringUtils.match("qTcms_S_p_id=\"(.*?)\"", content, 1);
    if (str != null) {
        str = DecryptionUtils.base64Decrypt(str);
        var array = str.split("\\$qingtiandy\\$");
        var preUrl = "";
        if(Integer.parseInt(str_id)>542724){
            preUrl = "https://mhpic5.miyeye.cn:20208";
        }else {
            preUrl = "https://res.gezhengzhongyi.cn:20207";
        }
        if (Integer.parseInt(str_id)>884998){
            preUrl = "https://mhpic88.miyeye.cn:20207";
        }

        for (var i = 0; i != array.length; ++i) {
            var url = preUrl + array[i];
            list.add(new ImageUrl(i+1, url, false));
        }
    }

    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", "/kanmanhua/all/"));
    list.add(Pair.create("热血", "/kanmanhua/rexue/"));
    list.add(Pair.create("格斗", "/kanmanhua/gedou/"));
    list.add(Pair.create("科幻", "/kanmanhua/kehuan/"));
    list.add(Pair.create("竞技", "/kanmanhua/jingji/"));
    list.add(Pair.create("搞笑", "/kanmanhua/gaoxiao/"));
    list.add(Pair.create("推理", "/kanmanhua/tuili/"));
    list.add(Pair.create("恐怖", "/kanmanhua/kongbu/"));
    list.add(Pair.create("耽美", "/kanmanhua/danmei/"));
    list.add(Pair.create("少女", "/kanmanhua/shaonv/"));
    list.add(Pair.create("恋爱", "/kanmanhua/lianai/"));
    list.add(Pair.create("生活", "/kanmanhua/shenghuo/"));
    list.add(Pair.create("战争", "/kanmanhua/zhanzheng/"));
    list.add(Pair.create("故事", "/kanmanhua/gushi/"));
    list.add(Pair.create("冒险", "/kanmanhua/maoxian/"));
    list.add(Pair.create("魔幻", "/kanmanhua/mohuan/"));
    list.add(Pair.create("玄幻", "/kanmanhua/xuanhuan/"));
    list.add(Pair.create("校园", "/kanmanhua/xiaoyuan/"));
    list.add(Pair.create("悬疑", "/kanmanhua/xuanyi/"));
    list.add(Pair.create("萌系", "/kanmanhua/mengxi/"));
    list.add(Pair.create("穿越", "/kanmanhua/chuanyue/"));
    list.add(Pair.create("后宫", "/kanmanhua/hougong/"));
    list.add(Pair.create("都市", "/kanmanhua/dushi/"));
    list.add(Pair.create("武侠", "/kanmanhua/wuxia/"));
    list.add(Pair.create("历史", "/kanmanhua/lishi/"));
    list.add(Pair.create("同人", "/kanmanhua/tongren/"));
    list.add(Pair.create("励志", "/kanmanhua/lizhi/"));
    list.add(Pair.create("百合", "/kanmanhua/baihe/"));
    list.add(Pair.create("治愈", "/kanmanhua/zhiyu/"));
    list.add(Pair.create("机甲", "/kanmanhua/jijia/"));
    list.add(Pair.create("纯爱", "/kanmanhua/chunai/"));
    list.add(Pair.create("美食", "/kanmanhua/meishi/"));
    list.add(Pair.create("僵尸", "/kanmanhua/jiangshi/"));
    list.add(Pair.create("恶搞", "/kanmanhua/egao/"));
    list.add(Pair.create("虐心", "/kanmanhua/nuexin/"));
    list.add(Pair.create("动作", "/kanmanhua/dongzuo/"));
    list.add(Pair.create("惊险", "/kanmanhua/jingxian/"));
    list.add(Pair.create("唯美", "/kanmanhua/weimei/"));
    list.add(Pair.create("震撼", "/kanmanhua/zhenhan/"));
    list.add(Pair.create("复仇", "/kanmanhua/fuchou/"));
    list.add(Pair.create("侦探", "/kanmanhua/zhentan/"));
    list.add(Pair.create("脑洞", "/kanmanhua/naodong/"));
    list.add(Pair.create("奇幻", "/kanmanhua/qihuan/"));
    list.add(Pair.create("宫斗", "/kanmanhua/gongdou/"));
    list.add(Pair.create("爆笑", "/kanmanhua/baoxiao/"));
    list.add(Pair.create("运动", "/kanmanhua/yundong/"));
    list.add(Pair.create("青春", "/kanmanhua/qingchun/"));
    list.add(Pair.create("灵异", "/kanmanhua/lingyi/"));
    list.add(Pair.create("古风", "/kanmanhua/gufeng/"));
    list.add(Pair.create("权谋", "/kanmanhua/quanmou/"));
    list.add(Pair.create("节操", "/kanmanhua/jiecao/"));
    list.add(Pair.create("明星", "/kanmanhua/mingxing/"));
    list.add(Pair.create("暗黑", "/kanmanhua/anhei/"));
    list.add(Pair.create("社会", "/kanmanhua/shehui/"));
    list.add(Pair.create("浪漫", "/kanmanhua/langman/"));
    list.add(Pair.create("栏目", "/kanmanhua/lanmu/"));
    list.add(Pair.create("仙侠", "/kanmanhua/xianxia/"));

    return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "https://www.mh160.xyz"+ format + page + ".html";
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();

    var body = new Node(content);
    var searchList = body.list(".mh-search-list li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit(".mh-works-title h4 a", 1);
        var title = node.text(".mh-works-title h4");
        var cover = node.src(".mh-nlook-w > a img");
        Log.d("图片地址", cover);
        var update = node.text(".mh-works-author");
        update = update.replace("状态:", "");
        var author = node.text(".mh-works-tags span em");
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}