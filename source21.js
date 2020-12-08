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

// 版本号
var version = 1.0;
// 是否启用
var enable = true;
// 源标题
var title = "89漫画";
// 类型，相当于java中TYPE
var sort = 21;

// 请求头
function getSearchRequest (keyword, page) {
    var url = "http://m.89mh.com/statics/qingtiancms.ashx";
    var requestBodyPost = new FormBody.Builder()
            .add("pagesize", "12")
            .add("key", keyword)
            .add("action", "GetWapList")
            .add("classid1", "0")
            .add("url", "/statics/qingtiancms.ashx")
            .add("page", page+"")
            .build();

    return new Request.Builder().url(url)
            .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19")
            .post(requestBodyPost)
            .build();
}

// 解析搜索页面
function getSearchIterator() {
   var body = new Node(content);
   var searchList = body.list("li");
   var list = new ArrayList();
   for (var i = 0; i < searchList.size(); i ++) {
       var node = searchList.get(i);
       var cid = node.attr(".ImgA", "href");
       cid = cid.replace("/", "_");
       var title = node.text(".txtA");
       var cover = node.src("img");
       var update = "";
       list.add(new Comic(sort, cid, title, cover, update, null));
   }
   return list;
}

//请求漫画详情
function getInfoRequest(cid) {
    var url = cid.replace(/_/g, "/");
    url = "http://m.89mh.com/" + url;
    Log.d("测试", "getImagesRequest: "+url);
    return new Request.Builder().url(url).build();
}

//解析漫画详情
function parseInfo() {
//    java代码中注入的网页源码 content
    var body = new Node(content);
    var update = body.text(".Introduct_Sub .txtItme .date");
    var title = StringUtils.match("title:\\\"(.+)\\\",c", content, 1);
    var intro = body.text(".Introduct .txtDesc");
    var author = body.text(".Introduct_Sub .txtItme:eq(1)");
    var cover = body.attr("#Cover img", "src");
    var status = false;
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
        var path = node.href("a");
        list.add(new Chapter(title.trim(), path));
    }
    return list;
}

// 请求漫画展示详情
function getImagesRequest(cid, path) {
      var url = "http://m.89mh.com/" + path;
      return new Request.Builder()
              .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19")
              .url(url)
              .build();
}

function getHeader () {
    return Headers.of("Referer", "https://h5.manhua.163.com");
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
    var base_url = "http://image.xmanhua.com/";
    var data = StringUtils.match("qTcms_S_m_murl_e=\\\"(.+)\\\";", content, 1);

    var image_urls = DecryptionUtils.base64Decrypt(data);
    Log.d("测试匹配", "parseImages: "+image_urls);
    var arr = image_urls.split("\\$qingtiandy\\$");
    for (var i = 0; i < arr.length; i ++) {
        var url = arr[i];
        Log.d("地址", "parseImages: "+url);
        list.add(new ImageUrl(i+1, url,false));
        i++;
    }
    return list;
}

// 获取分类
function get_subject () {
   var list = new ArrayList();
   list.add(Pair.create("全部", "/all/"));
   list.add(Pair.create("热血", "/rexue/"));
   list.add(Pair.create("格斗", "/gedou/"));
   list.add(Pair.create("科幻", "/kehuan/"));
   list.add(Pair.create("竞技", "/jingji/"));
   list.add(Pair.create("搞笑", "/gaoxiao/"));
   list.add(Pair.create("推理", "/tuili/"));
   list.add(Pair.create("恐怖", "/kongbu/"));
   list.add(Pair.create("少女", "/shaonv/"));
   list.add(Pair.create("恋爱", "/lianai/"));
   list.add(Pair.create("生活", "/shenghuo/"));
   list.add(Pair.create("战争", "/zhanzheng/"));
   list.add(Pair.create("故事", "/gushi/"));
   list.add(Pair.create("冒险", "/maoxian/"));
   list.add(Pair.create("魔幻", "/mohuan/"));
   list.add(Pair.create("玄幻", "/xuanhuan/"));
   list.add(Pair.create("校园", "/xiaoyuan/"));
   list.add(Pair.create("悬疑", "/xuanyi/"));
   list.add(Pair.create("萌系", "/mengxi/"));
   list.add(Pair.create("穿越", "/chuanyue/"));
   list.add(Pair.create("后宫", "/hougong/"));
   list.add(Pair.create("都市", "/dushi/"));
   list.add(Pair.create("武侠", "/wuxia/"));
   list.add(Pair.create("历史", "/lishi/"));
   list.add(Pair.create("同人", "/tongren/"));
   list.add(Pair.create("励志", "/lizhi/"));
   list.add(Pair.create("治愈", "/zhiyu/"));
   list.add(Pair.create("机甲", "/jijia/"));
   list.add(Pair.create("纯爱", "/chunai/"));
   list.add(Pair.create("美食", "/meishi/"));
   list.add(Pair.create("血腥", "/xuexing/"));
   list.add(Pair.create("僵尸", "/jiangshi/"));
   list.add(Pair.create("恶搞", "/egao/"));
   list.add(Pair.create("虐心", "/nuexin/"));
   list.add(Pair.create("动作", "/dongzuo/"));
   list.add(Pair.create("惊险", "/jingxian/"));
   list.add(Pair.create("唯美", "/weimei/"));
   list.add(Pair.create("震撼", "/zhenhan/"));
   list.add(Pair.create("复仇", "/fuchou/"));
   list.add(Pair.create("侦探", "/zhentan/"));
   list.add(Pair.create("脑洞", "/naodong/"));
   list.add(Pair.create("奇幻", "/qihuan/"));
   list.add(Pair.create("宫斗", "/gongdou/"));
   list.add(Pair.create("爆笑", "/baoxiao/"));
   list.add(Pair.create("运动", "/yundong/"));
   list.add(Pair.create("青春", "/qingchun/"));
   list.add(Pair.create("灵异", "/lingyi/"));
   list.add(Pair.create("古风", "/gufeng/"));
   list.add(Pair.create("权谋", "/quanmou/"));
   list.add(Pair.create("节操", "/jiecao/"));
   list.add(Pair.create("明星", "/mingxing/"));
   list.add(Pair.create("暗黑", "/anhei/"));
   list.add(Pair.create("社会", "/shehui/"));
   list.add(Pair.create("浪漫", "/langman/"));
   list.add(Pair.create("栏目", "/lanmu/"));
   list.add(Pair.create("仙侠", "/xianxia/"));
   list.add(Pair.create("日常", "/richang/"));
   list.add(Pair.create("邪恶", "/xiee/"));
   list.add(Pair.create("职场", "/zhichang/"));
   list.add(Pair.create("宅男", "/zhainan/"));
   list.add(Pair.create("爱情", "/aiqing/"));
   list.add(Pair.create("四格", "/sige/"));
   list.add(Pair.create("剧情", "/juqing/"));
   list.add(Pair.create("神魔", "/shenmo/"));
   list.add(Pair.create("体育", "/tiyu/"));
   list.add(Pair.create("霸总", "/bazong/"));
   list.add(Pair.create("总裁", "/zongcai/"));
   list.add(Pair.create("修真", "/xiuzhen/"));
   list.add(Pair.create("真人", "/zhenren/"));
   list.add(Pair.create("萝莉", "/luoli/"));
   list.add(Pair.create("御姐", "/yujie/"));
   list.add(Pair.create("架空", "/jiakong/"));
   list.add(Pair.create("彩虹", "/caihong/"));
   list.add(Pair.create("游戏", "/youxi/"));
   list.add(Pair.create("魔法", "/mofa/"));
   list.add(Pair.create("舰娘", "/jianniang/"));
   list.add(Pair.create("神鬼", "/shengui/"));
   list.add(Pair.create("东方", "/dongfang/"));
   list.add(Pair.create("颜艺", "/yanyi/"));
   list.add(Pair.create("短篇", "/duanpian/"));
   list.add(Pair.create("杂志", "/zazhi/"));
   list.add(Pair.create("青年", "/qingnian/"));
   list.add(Pair.create("单行", "/danxing/"));
   list.add(Pair.create("吸血", "/xixue/"));
   list.add(Pair.create("音乐", "/yinle/"));
   list.add(Pair.create("轻小说", "/qingxiaoshuo/"));
   return list;
}

// 请求漫画展示详情
function getCategoryRequest(format, page) {
   var url = "http://www.89mh.com"+format+page+".html";
   return new Request.Builder()
        .url(url).build();
}

//解析推荐
function parseCategory() {
    var list = new ArrayList();
    var body = new Node(content);
    var searchList = body.list("#ul_list > li");
    var list = new ArrayList();
    for (var i = 0; i < searchList.size(); i ++) {
        var node = searchList.get(i);
        var cid = node.attr(".mh-item-tip > a", "href");
        cid = cid.replace("/", "_");
        var title = node.text(".title a");
        var cover = node.attr(".mh-cover", "style");
        cover = StringUtils.match("url\\((.+)\\)", cover, 1);
        var update = node.text(".chapter");
        var author = "";
        list.add(new Comic(sort, cid, title, cover, update, author));
    }
    return list;
}