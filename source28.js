importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
importPackage(Packages.org.json)
importPackage(Packages.java.lang)
importClass(Packages.okhttp3.Request)
importClass(Packages.okhttp3.Headers)
importClass(Packages.okhttp3.FormBody)
importPackage(Packages.com.reader.comic.model)
importClass(Packages.com.reader.comic.utils.StringUtils)
importClass(Packages.com.reader.comic.soup.Node)
importClass(Packages.java.net.URLEncoder)
importClass(Packages.com.reader.comic.utils.DecryptionUtils)
importClass(Packages.java.util.regex.Matcher)
importClass(Packages.java.util.regex.Pattern)


// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "漫画堆";
// 类型，相当于java中TYPE
var sort = 28;
var website = "https://www.manhuabei.com";
var server = ["https://mhcdn.manhuazj.com"];

// 请求头
function getSearchRequest (keyword, page) {
    var url = StringUtils.format("%s/search/?keywords=%s&page=%s", website, keyword, page+"");
    return new Request.Builder()
       .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
       .url(url).build();
}

//解析搜索页面: content是脚本注入
function getSearchIterator() {
    var body = new Node(content);
    var searchList = body.list("ul.list_con_li > li.list-comic");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
       var node = searchList.get(i);
       var cid = node.hrefWithSplit("a", 1);
       var title = node.attr("a","title");
       var cover = node.src("img");
       if (cover.startsWith("//")) cover = "https:" + cover;
       var update = node.text("p.newPage");
       var author = node.text("p.auth");
       list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}

//请求漫画详情
function getInfoRequest(cid) {
   var url = StringUtils.format("%s/manhua/%s/", website, cid);
   return new Request.Builder()
     .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
     .url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var intro = body.text("p.comic_deCon_d");
    var title = body.text("div.comic_deCon > h1");
    var cover = body.src("div.comic_i_img > img");
    if (cover.startsWith("//")) cover = "https:" + cover;
    var author = body.text(".Introduct_Sub .sub_r .txtItme:first-child");
    var update = "";
    var status = false;
    var comic = new Comic(sort, "");
    comic.setInfo(title, cover, update, intro, author, status);
    return comic;
}

// 解析章节
function parseChapter () {
    var body = new Node(content);
    var chapterList = body.list("div.zj_list_con > ul > li");
    var list = new ArrayList();
    for (var i = chapterList.size() - 1; i >= 0; i --) {
        var node = chapterList.get(i);
        var title = node.attr("a", "title");
        var path = StringUtils.split(node.href("a"), "/", 3);;
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
    var url = StringUtils.format("%s/manhua/%s/%s", website, cid, path);
    return new Request.Builder()
        .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
        .url(url).build();
}

function getHeader () {
    return Headers.of("Referer", "http://m.517manhua.com/");
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
    //该章节的所有图片url，aes加密
    var arrayStringCode = decrypt(StringUtils.match("var chapterImages =[\\s\\n]*\"(.*?)\";", content, 1));
    if (arrayStringCode == null) return list;
//    Log.d("网页内容", arrayStringCode);
    var imageList = JSON.parse(arrayStringCode);
    //章节url，用于拼接最终的图片url
    var chapterPath = StringUtils.match("var chapterPath = \"([\\s\\S]*?)\";", content, 1);

    var imageListSize = imageList.length;
    for (var i = 0; i != imageListSize; ++i) {
        var key = imageList[i];
        var imageUrl = getImageUrlByKey(key, server[0], chapterPath);

        if(imageUrl.indexOf("images.dmzj.com") >= 0)
            imageUrl = "https://img01.eshanyao.com/showImage.php?url=" + imageUrl;

        list.add(new ImageUrl(i + 1, imageUrl, false));
    }


    return list;
}

// 获取分类
function get_subject () {
    var list = new ArrayList();
    list.add(Pair.create("全部", ""));
    list.add(Pair.create("热血", "rexue"));
    list.add(Pair.create("冒险", "maoxian"));
    list.add(Pair.create("玄幻", "xuanhuan"));
    list.add(Pair.create("搞笑", "gaoxiao"));
    list.add(Pair.create("恋爱", "lianai"));
    list.add(Pair.create("宠物", "chongwu"));
    list.add(Pair.create("新作", "xinzuo"));
    list.add(Pair.create("神魔", "shenmo"));
    list.add(Pair.create("竞技", "jingji"));
    list.add(Pair.create("穿越", "chuanyue"));
    list.add(Pair.create("漫改", "mangai"));
    list.add(Pair.create("霸总", "bazong"));
    list.add(Pair.create("都市", "dushi"));
    list.add(Pair.create("武侠", "wuxia"));
    list.add(Pair.create("社会", "shehui"));
    list.add(Pair.create("古风", "gufeng"));
    list.add(Pair.create("恐怖", "kongbu"));
    list.add(Pair.create("东方", "dongfang"));
    list.add(Pair.create("格斗", "gedou"));
    list.add(Pair.create("魔法", "mofa"));
    list.add(Pair.create("轻小说", "qingxiaoshuo"));
    list.add(Pair.create("魔幻", "mohuan"));
    list.add(Pair.create("生活", "shenghuo"));
    list.add(Pair.create("欢乐向", "huanlexiang"));
    list.add(Pair.create("励志", "lizhi"));
    list.add(Pair.create("音乐舞蹈", "yinyuewudao"));
    list.add(Pair.create("科幻", "kehuan"));
    list.add(Pair.create("美食", "meishi"));
    list.add(Pair.create("节操", "jiecao"));
    list.add(Pair.create("神鬼", "shengui"));
    list.add(Pair.create("爱情", "aiqing"));
    list.add(Pair.create("校园", "xiaoyuan"));
    list.add(Pair.create("治愈", "zhiyu"));
    list.add(Pair.create("奇幻", "qihuan"));
    list.add(Pair.create("仙侠", "xianxia"));
    list.add(Pair.create("运动", "yundong"));
    list.add(Pair.create("动作", "dongzuo"));
    list.add(Pair.create("日更", "rigeng"));
    list.add(Pair.create("历史", "lishi"));
    list.add(Pair.create("推理", "tuili"));
    list.add(Pair.create("悬疑", "xuanyi"));
    list.add(Pair.create("修真", "xiuzhen"));
    list.add(Pair.create("游戏", "youxi"));
    list.add(Pair.create("战争", "zhanzheng"));
    list.add(Pair.create("后宫", "hougong"));
    list.add(Pair.create("职场", "zhichang"));
    list.add(Pair.create("四格", "sige"));
    list.add(Pair.create("性转换", "xingzhuanhuan"));
    list.add(Pair.create("伪娘", "weiniang"));
    list.add(Pair.create("颜艺", "yanyi"));
    list.add(Pair.create("真人", "zhenren"));
    list.add(Pair.create("杂志", "zazhi"));
    list.add(Pair.create("侦探", "zhentan"));
    list.add(Pair.create("萌系", "mengxi"));
    list.add(Pair.create("耽美", "danmei"));
    list.add(Pair.create("百合", "baihe"));
    list.add(Pair.create("西方魔幻", "xifangmohuan"));
    list.add(Pair.create("机战", "jizhan"));
    list.add(Pair.create("宅系", "zhaixi"));
    list.add(Pair.create("忍者", "renzhe"));
    list.add(Pair.create("萝莉", "luoli"));
    list.add(Pair.create("异世界", "yishijie"));
    list.add(Pair.create("吸血", "xixie"));
    list.add(Pair.create("其他", "qita"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
    if (!format.equals("")) {
       format = format+"/";
    }
    var url = "https://m.manhuadai.com/list/"+format+"?page="+page;
    Log.d("请求地址", "getCategoryRequest: "+url);
   return new Request.Builder()
           .addHeader("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")
           .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list("#comic-items > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.hrefWithSplit("a.ImgA", 1);
        var title = node.text("a.txtA");
        var cover = node.src("a.ImgA img");
        if (cover.startsWith("//")) cover = "https:" + cover;
        Log.d("图片地址", cover);
        var update = node.text(".info");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}



function decrypt (code) {
    var key = "KA58ZAQ321oobbG8";
    var iv = "A1B2C3DEF1G321o8";
    return DecryptionUtils.aesDecrypt(code, key, iv);
}

function getImageUrlByKey(key, domain, chapter) {
    if (Pattern.matches("\\^https?://(images.dmzj.com|imgsmall.dmzj.com)/i", key)) {
        return domain + "/showImage.php?url=" + URLEncoder.encode(key, "utf-8");
    }
    if (Pattern.matches("\\^[a-z]//i", key)) {
        return domain + "/showImage.php?url=" + URLEncoder.encode("https://images.dmzj.com/" + key, "utf-8");
    }
    if (key.startsWith("http") || key.startsWith("ftp")) return key;
    return domain + "/" + chapter + key;
}