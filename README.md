<img src="./images/app_icon.png" width="150">

# 应用简介

Android 平台在线漫画阅读器, 基于cimoc项目进行二次开发项目，感谢原作者。
Online manga reader based on Android
Second development project based on cimoc project, thank the original author


# 下载
> 关于app下载，大家可以在蓝奏云上面进行下载，目前有3.1版本，3.0版本和1.6.6版本。其中这三个版本主要差别是在漫画源，3.1和3.0版本已经将漫画抽离出来了，我本身只能维护线上这些源，如果你有能力可以自己写源，并且导入，里面有测试。大家可以根据教程进行进行编写，源所用的依赖类，是基于cimoc中工具类，这些没变动。注意，跨本版升级，要卸载老版本，否则会崩溃.
> app的下载地址： [漫漫看](https://wws.lanzous.com/b01tpu2dg)
> 链接地址：https://wws.lanzous.com/b01tpu2dg



# 漫画源
> 各位大佬们提交漫画源相关issue，也可以进入qq群交流：764560208。输入源名称，修改一下js代码，然后同步一下源就可以了，或者本地导入网络导入都行。

# 功能简介
- 漫画推荐（Cartoon recommendation）
- 翻页阅读（Page Reader）
- 卷纸阅读（Scroll Reader）
- 检查漫画更新（Check Manga For Update）
- 下载漫画（Download Manga）
- 本地漫画（Local Reader）
- 本地备份恢复（Local Backup）

# 软件使用说明
- 安装完成后，app中并没有数据，请先同步一下最新的漫画源，这样才有数据




# 应用截图
<img src="./images/1.jpg" width="250">
<img src="./images/2.jpg" width="250">
<img src="./images/3.jpg" width="250">
<img src="./images/4.jpg" width="250">
<img src="./images/5.jpg" width="250">
<img src="./images/6.jpg" width="250">
<img src="./images/7.jpg" width="250">

# 增加图源（欢迎pr）
- 关于开发新的图源，你可以参考项目中js，所有套路都是一样的，可能解析漫画地址的核心逻辑会不一样。整体逻辑都是一样，注意每个源type是唯一的，请注意参考。
> 3.1版本的源开发教程
> 自己开发源后，本地导入，或者网络导入都行。
> 关于源书写教程

```js

图源制作教程：
图源管理：本地和网络导入时：将源对象打包json数组字符串，导入app。
新建图源是：本地和网络导入json对象，进行调试。
下面一个源简单示例：

var source = {
  comicSourceName: '奇妙漫画💯', // 图源标题
  comicSourceUrl: 'https://www.qimiaomh.com/', // 图源地址
  enable: true, // 是否启用
  imgHeaders: // 图片请求头：有的网站是必须要有的，三个函数：getHeader, getHeader2, getHeader3,
  'function getHeader(){return Headers.of("Referer","https://www.nadu8.com/")}function getHeader2(url){return getHeader()}function getHeader3(){return getHeader()};',

  // 漫画详情： %s 替换cid
  ruleComicInfoUrl: 'https://www.qimiaomh.com/manhua/%s.html',
  ruleComicTitle: '@css:.ctdbRightInner .title@text', // 详情标题
  ruleComicAuthor: '@css:.author@text@js:result.replace("作者","")', // 详情作者
  ruleComicCover:
  '@css:.ctdbLeft a >img@src ', // 封面
  ruleComicInstro: '@css:#worksDesc@text', // 简介
  ruleComicStatus: false,  // 更新状态
  ruleComicLianZai: '', // 连载解析是否完结
  ruleComicUpdate: '@css:.updeteStatus .date@text@js:result.replace("更新","")', // 更新
  ruleChapterList: '@css:.comic-content-list .comic-content-c',
  ruleChapterName: '@css:.tit a@text',
  ruleChapterUrl: '@css:.tit a@href@js:var did=java.splitHref(result,-3);var sid=java.splitHref(result,-2);"/Action/Play/AjaxLoadImgUrl?did="+did+"&sid="+sid',

  // 图片详情
  ruleContentUrl: // 两个替换参数 param1==cid, param2==path
  'https://www.qimiaomh.comparam2',
 // /<script>var sFiles.+<\\/script>/ 要打\\两个反斜杠
  ruleComicContent:  // 漫画图片解析: 导入依赖包，content注入内容
  `
  importClass(Packages.java.util.ArrayList)
  importPackage(Packages.com.reader.comic.model)
  importClass(Packages.com.reader.comic.utils.StringUtils)
  importClass(Packages.com.reader.comic.soup.Node)

  function parseImages() {
      var list = new ArrayList();
      var picdata = JSON.parse(content);

      for (var i = 0 ; i < picdata.listImg.length; i ++) {
          var url = picdata.listImg[i];
          list.add(new ImageUrl(i+1, url, false));
      }
      return list;
  }


  `,

  // 推荐

  ruleFindAuthor: '',
  ruleFindCid: '@css:h2 a@href@js:java.splitHref(result, -2)',
  ruleFindCoverUrl:
  '@css:.tit_img@data-src',
  ruleFindList: 'class.classification',
  ruleFindTitle: '@css:h2 a@text',
  ruleFindUpdate: '@css:.describe@text',
  ruleFindUrl:`
  全部::https://www.qimiaomh.com/list-1------updatetime--searchPage.html&&热血::https://www.qimiaomh.com/list-1-7-----updatetime--searchPage.html&&恋爱::https://www.qimiaomh.com/list-1-8-----updatetime--searchPage.html&&青春::https://www.qimiaomh.com/list-1-9-----updatetime--searchPage.html&&彩虹::https://www.qimiaomh.com/list-1-10-----updatetime--searchPage.html&&冒险::https://www.qimiaomh.com/list-1-11-----updatetime--searchPage.html&&后宫::https://www.qimiaomh.com/list-1-12-----updatetime--searchPage.html&&悬疑::https://www.qimiaomh.com/list-1-13-----updatetime--searchPage.html&&玄幻::https://www.qimiaomh.com/list-1-14-----updatetime--searchPage.html&&穿越::https://www.qimiaomh.com/list-1-16-----updatetime--searchPage.html&&都市::https://www.qimiaomh.com/list-1-17-----updatetime--searchPage.html&&腹黑::https://www.qimiaomh.com/list-1-18-----updatetime--searchPage.html&&爆笑::https://www.qimiaomh.com/list-1-19-----updatetime--searchPage.html&&少年::https://www.qimiaomh.com/list-1-20-----updatetime--searchPage.html&&奇幻::https://www.qimiaomh.com/list-1-21-----updatetime--searchPage.html&&古风::https://www.qimiaomh.com/list-1-22-----updatetime--searchPage.html&&妖恋::https://www.qimiaomh.com/list-1-23-----updatetime--searchPage.html&&元气::https://www.qimiaomh.com/list-1-24-----updatetime--searchPage.html&&治愈::https://www.qimiaomh.com/list-1-25-----updatetime--searchPage.html&&励志::https://www.qimiaomh.com/list-1-26-----updatetime--searchPage.html&&日常::https://www.qimiaomh.com/list-1-27-----updatetime--searchPage.html&&百合::https://www.qimiaomh.com/list-1-28-----updatetime--searchPage.html
  `
  ,


  // 搜索

  ruleSearchAuthor: '',
  ruleSearchCid: '@css:h2 a@href@js:java.splitHref(result, -2)',
  ruleSearchCoverUrl: '@css:.tit_img@data-src',
  ruleSearchList: 'class.classification',
  ruleSearchTitle: '@css:h2 a@text',
  ruleSearchUpdate: '@css:.describe@text',
  ruleSearchUrl:
  'https://www.qimiaomh.com/action/Search?keyword=searchKey&page=searchPage',


  sort: '79',
  type: 79
};
本示例采用node进行开发的：
写入代码：
var arr = [];
arr.push(source);
var str = JSON.stringify(arr);
fs.writeFile("./data.json", str, error => {
  if (error) return console.log("写入文件失败,原因是" + error.message);
  console.log("写入成功");
});




 支持jsoup select语法,以@css:开头,语法见http://www.open-open.com/jsoup/selector-syntax.htm
- 支持JSonPath语法,以@JSon:开头,语法见 https://blog.csdn.net/koflance/article/details/63262484
- JsonPath获取字符支持此种写法xxx{$._id}yyy{$.chapter}zzz
- 支持用js处理结果,以<js>开头</js>结尾,或者@js, 结果变量为result,网址变量为bastPath,位置任意,按顺序执行
  如 <js>result=result.replace(/[\\w\\W]*url:'(.*?)'[\\w\\W]*/,\"$1\");
- ##替换内容##替换为,支持正则
- 可以使用@Header:{key:value,key:value}定义访问头,添加在Url规则头部,或尾部
- 除去封面地址,其它地址都支持搜索地址的表达方式
- 自定义js方法
java.substring(String str, int start)
java.evalJS(String jsStr, Object result)
java.getFormatTime (String format, long time)
java.splitHref (String str, int index)

简单规则写法
- @为分隔符,用来分隔获取规则
- 每段规则可分为3段
- 第一段是类型,如class,id,tag,text,children等, children获取所有子标签,不需要第二段和第三段,text可以根据文本内容获取
- 第二段是名称,text. 第二段为文本内容的一部分
- 第三段是位置,class,tag,id等会获取到多个,所以要加位置
- 如不加位置会获取所有
- 位置正数从0开始,0是第一个,如为负数则是取倒数的值,-1为最倒数第一个,-2为倒数第二个
- !是排除,有些位置不符合需要排除用!,后面的序号用:隔开0是第1个,负数为倒数序号,-1最后一个,-2倒数第2个,依次
- 获取列表的最前面加上负号- 可以使列表倒置,有些网站目录列表是倒的,前面加个负号可变为正的
- @的最后一段为获取内容,如text,textNodes,href,src,html等
- 如果有不同网页的规则可以用 || 或 && 分隔 或 %%
- ||会以第一个取到值的为准,
- && 会合并所有规则取到的值,
- %% 会依次取数,如三个列表,先取列表1的第一个,再取列表2的第一个,再取列表3的第一个,再取列表1的第2个.......
- 如需要正则替换在最后加上 ##正则表达式##替换为,##替换最新版本支持所有规则
- 例:class.odd.0@tag.a.0@text|tag.dd.0@tag.h1@text#全文阅读
- 例:class.odd.0@tag.a.0@text&tag.dd.0@tag.h1@text#全文阅读




```

> 3.0版本的源开发教程
> 自己开发源后，本地导入，或者网络导入都行。
> 关于源书写教程
 ```js
 // 导入依赖包
importPackage(Packages.org.json)
importPackage(Packages.java.lang)

// 导入需要依赖的类
importClass(Packages.android.util.Log)
importClass(Packages.android.util.Pair)
importClass(Packages.java.util.ArrayList)
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
// 类型, 类型必须是唯一的，不然会导入失败
var sort = 2;

// 请求头, 可以用addHeader添加请求头
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

// 每个源所依赖的包或者类必须导入，每个源中函数名称都是一样的，核心逻辑也都类似，参照现有源基本可以构建新的源

 ```

## cimoc设置
- 阅读模式－翻页模式-卷纸模式
- 定义点击事件－左上－上一页，右下下一页
- 自定义长按点击事件-切换阅读模式
- 启用快速翻页（减少）
- 自动裁剪百边
- 禁止双击放大
- 启用通知栏


# 软件更新方向：
- 能正常搜索解析网络上大部分免费的漫画
- 界面简洁为主
- 解决apk影响体验的问题


# 免责声明：
- 如果更新软件的过程中有什么侵权的地方，请在github上留言或者私信我，提供相关版权证明，会马上删除侵权部分的内容。
- 本软件开发，是为了码农之间的技术交流，以及解决软件测试过程中出现的各种bug。
- 后期如进行到了服务器的开发，会开个新分支公开服务器开发所用的代码，以及公开服务器内存放的所有内容，
- 本软件不以盈利为目的，广告收入全部用于服务器维护和开发。
