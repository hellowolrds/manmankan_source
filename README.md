<img src="./images/app_icon.png" width="150">

# 应用简介

Android 平台在线漫画阅读器, 基于cimoc项目进行二次开发项目，感谢原作者。
Online manga reader based on Android
Second development project based on cimoc project, thank the original author


# 下载
> 关于app下载，大家可以在蓝奏云上面进行下载，目前有3.0版本和1.6.6版本。其中这两个版本主要差别是在漫画源，3.0版本已经将漫画抽离出来了，我本身只能维护线上这些源，如果你有能力可以自己写源，并且导入，里面有测试。大家可以根据教程进行进行编写，源所用的依赖类，是基于cimoc中工具类，这些没变动。
> app的下载地址： [漫漫看](https://wws.lanzous.com/b01tpu2dg)
> 链接地址：https://wws.lanzous.com/b01tpu2dg



# 漫画源
> 各位大佬们提交漫画源相关issue，输入源名称，我只要修改一下js代码，然后同步一下源就可以了。

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


# 感谢以下的开源项目及作者
- [Android Open Source Project](http://source.android.com/)
- [ButterKnife](https://github.com/JakeWharton/butterknife)
- [GreenDAO](https://github.com/greenrobot/greenDAO)
- [OkHttp](https://github.com/square/okhttp)
- [Fresco](https://github.com/facebook/fresco)
- [Jsoup](https://github.com/jhy/jsoup)
- [DiscreteSeekBar](https://github.com/AnderWeb/discreteSeekBar)
- [RxJava](https://github.com/ReactiveX/RxJava)
- [RxAndroid](https://github.com/ReactiveX/RxAndroid)
- [RecyclerViewPager](https://github.com/lsjwzh/RecyclerViewPager)
- [PhotoDraweeView](https://github.com/ongakuer/PhotoDraweeView)
- [Rhino](https://github.com/mozilla/rhino)
- [BlazingChain](https://github.com/tommyettinger/BlazingChain)
- [AppUpdater](https://gitee.com/jenly1314/AppUpdater)


# 应用截图
<img src="./images/1.jpg" width="250">
<img src="./images/2.jpg" width="250">
<img src="./images/3.jpg" width="250">
<img src="./images/4.jpg" width="250">
<img src="./images/5.jpg" width="250">
<img src="./images/6.jpg" width="250">
<img src="./images/7.jpg" width="250">

# 增加图源（欢迎pr）
- 关于开发新的图源，你可以参考项目中js，所有套路都是一样的，可能解析漫画地址的核心逻辑会不一样。整体逻辑都是一样，注意没个源sort是唯一的，请注意参考。
> 自己开发源后，本地导入，或者网络导入都行。


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
