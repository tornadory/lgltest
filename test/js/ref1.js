
// 获取参数
function getParameterValue(name, defaultValue) {
    var value = "";
    var findName = false;
    var url = location.href;
    var position = url.indexOf("?");
    var parameterStr = url.substr(position + 1);//Get the string after ?
    var arr = parameterStr.split("&");
    for (i = 0; i < arr.length; i++) {
        var parameter = arr[i].split("=");
        if (decodeURI(parameter[0]) == name) {
            value = parameter[1];
            findName = true;
            break;
        }
    }
    if (findName == false) {
        value = defaultValue;
    }
    return value
}

window.phoenix = window.phoenix || {};
phoenix.flashplayerVersion = "11.2.0";
phoenix.defaultSWF = "Phoenix.swf";
phoenix._top = 0;
phoenix._height = "100%";
phoenix._beforeunloadInterval = 0;
phoenix._renderSizeOptions = new Array();		// 效果图尺寸选项的数组，项目为{'width': xxx, 'height': xxx, 'name': xxx}


phoenix._structItems = {
    door: "481b6990484211e4a84200163e0206cd",
    doubleDoor: "9e4f4cc2a73b11e2b690782bcb748630",
    slidingDoor: "b59078daa7cb11e287cc782bcb748630",
    window: "d2307b04e1aa11e5809e00163e0018da",
    frenchWindow: "4a625c8c362c11e38caa00163e000ee8",
    bayWindow: "38213098616b11e28b89782bcb748630",
    floorBoard: "4f921108d13911e4879a00163e021ee1",
    floorTile: "8066fd448e5c11e5b86d00163e0018da",
    floorSkirting: "6d70132ef89811e4849a00163e021ee1",
    wallMaterial: "b24209ded48411e19421782bcb748630",
    ceilingMaterial: "b16ee7fcb62511e1ac95782bcb748630",
    stairnormal: "20c4320c27af11e6853200163e01117a",
    stairl: "04ae0e4e546911e6a06200163e01117a",
    stairu: "f6df7b6c27aa11e69d4a00163e0018da",
    stairo: "f038bbd2fff511e282f300163e000ee8",
    external_ac: "40341e2cc5ac11e68f6700163e01117a",
    external_lift: "704181bcf35211e6a06900163e1284d1"
}

phoenix.params = {
    quality: "high",
    bgcolor: "#ffffff",
    allowscriptaccess: "always",
    allowFullScreenInteractive: "true",
    wmode: "direct"
};

phoenix.attrs = {
    id: "Phoenix",
    name: "Phoenix",
    align: "middle"
}

phoenix.flashVars = {
    openCommand: "",
    language: "zh_CN",
    localeChain: "zh_CN",
    copyright: "true",	// 是否显示软件内部的爱福窝版权申明
    resourcePath: "./", // 软件内部使用资源路径
    webHost: "http://3d.fuwo.com",										// 服务接口调用的host
    mediaBaseUrl: "http://img.fuwo.com/",								// 模型，设计，效果图等文件存储根url
    ifuwoUrlPath: "/myhome3d/",											// 爱福窝设计软件的url路径
    wiringUrl: "http://3d.fuwo.com/ifuwo/wiring/",						// 水电布线url
    cabinetUrlPath: "/ifuwo/cabinet/",									// 定制柜子的url路径
    cupboardUrlPath: "http://3d.fuwo.com/cupboard/",								// 定制橱柜的url路径
    ceilingUrlPath: "/ifuwo/ceiling/",
    decorationUrlPath: "/ifuwo/ceiling/",                           // 全屋硬装的url路径
    tilerUrlPath: "/ifuwo/tiler/",									// 拼砖工具的url路径
    renderPanoViewUrl: "http://3d.fuwo.com/ifuwo/pano/render/${render_no}/",	// 全景效果图渲染浏览url
    designPanoViewUrl: "http://3d.fuwo.com/ifuwo/pano/design/${design_no}/",	// 设计全景漫游浏览url
    panoramaRenderSize: "3000x1500",									// 全景渲染效果图尺寸
    beautifyUrl: "http://3d.fuwo.com/meitu/", 							// 美图功能url
    standardCategoryTreeId: 1,											// 默认的物品类目树根id
    cadExportUrl: "http://3d.fuwo.com/ifuwo/tool/dxf/", 				// cad文件下载
    houseCadExportUrl: "http://3d.fuwo.com/ifuwo/houselayout/dxf/",     // 户型cad 文件导出
    messageListUrl: "http://3d.fuwo.com/ifuwo/msg/list/",				// 消息列表url
    messageDetailUrl: "http://3d.fuwo.com/ifuwo/msg/detail/",			// 消息详情url
    singleLoginOn: 1,													// 是否开启用户单会话登录
    loginUrl: "http://www.fuwo.com/sign/signin/",						// 登录url
    upgradeVipUrl: "https://item.taobao.com/item.htm?ft=t&spm=2013.1.0.0.2e538ffe4x9mqI&id=545611459770&scm=1007.12144.81309.42296_0&pvid=9b95645f-12bd-4626-9d4e-2373fbae1a2d",						// vip获取url
    preloaderSWFUrl: "http://static.fuwo.com/static/ifuwo/phoenix/assets/swf/preloader.swf",		// 预加载swf动画的url
    preloaderLogoUrl: "http://static.fuwo.com/static/ifuwo/phoenix/assets/image/logo/preloader/default.png",		// 预加载logo的url
    preloaderNotices: "使用搜索功能查找模型更方便,碰到喜欢的模型记得收藏起来",											// 预加载tips
    housemadeUrlPath_V2: "http://3d.fuwo.com/ifuwo/housemade_v2/",    // 新版地址

    guideSWFUrl: "http://static.fuwo.com/static/ifuwo/phoenix/phoenix/assets/swf/guide.swf",		//新手引导swf的url
    panoramaWanderMaxRoomLimit: 10,										// 全景漫游渲染最大房间数目限制
    budgetUrl: "http://3d.fuwo.com/design/${design_no}/budget/",		// 设计预算清单的budget Url, 软件内部需要用design no 替换这里的${design_no}
    itemManageUrl: "http://3d.fuwo.com/uc/model/own/",					// 模型管理跳转URL
    updateHistoryUrl: "http://www.fuwo.com/topic/150981/",				// 更新历史跳转URL


    merchantId: 0,														// 商家id
    merchantName: "爱福窝",												// 商家名称
    merchantExcludeCategoryIds: "",										// 商家版本中标准模型库需要排除的category_ids(格式"1,2,3,4")
    merchantResourceOn: "false",										// 是否显示商户资源列表
    merchantCategoryTreeId: 1,											// 商户资源类目树根id
    merchantSampleOn: 0,											    // 商家是否开启私有样板间库功能

    fcoinUnitName: "福币",												// fcoin单位名
    fcoinGainUrl: "http://www.fuwo.com/activity/1.html",				// fcoin获取跳转url
    sunlightDefault: "isOpen:1,intensity:1,pitchAngle:45,yawAngle:225",  // 太阳光默认属性值 isopen
    watermarkUrl: "http://static.fuwo.com/static/ifuwo/phoenix/phoenix/assets/images/logo/watermark.png",			// 平面下载水印资源路径
    floorplanBgUrl: "http://static.fuwo.com/static/ifuwo/phoenix/phoenix/assets/images/floorplan/floor_background.jpg" // 平面下载背景图资源路径
};

phoenix.setLaunchVars = phoenix.setFlashVars = function (k, v) {
    phoenix.flashVars[k] = v;
    if (k == "language") {
        phoenix.flashVars.localeChain = v;
    }
};

/**
* 设置flash object起始的top值
**/
phoenix.setTop = function (top) {
    phoenix._top = top;
    phoenix._height = document.documentElement.clientHeight - phoenix._top;
};

/**
* 设置多少毫秒后监听window.onbeforeunload事件，提示用户关闭时保存设计, 小于0时不设置
**/
phoenix.setBeforeunloadInterval = function (interval) {
    phoenix._beforeunloadInterval = interval;
};

/**
* 添加效果图渲染尺寸选项， width，height均为0时表示可自定义
* width - 效果图宽度
* height - 效果图高度
* name - 选项别名
**/
phoenix.addRenderSizeOption = function (width, height, name) {
    if (!arguments[2]) name = "";
    phoenix._renderSizeOptions.push({
        width: width,
        height: height,
        name: name
    });
};

/**
* 设置各种基本构造的默认物品编号
* structType - 基本构造类型
* itemNo - 物品编号
**/
phoenix.setStructItem = function (structType, itemNo) {
    phoenix._structItems[structType] = itemNo;
}

/**
* 嵌入SWF
*/
phoenix.embedSWF = function (swf, container) {

    phoenix.container = container;
    if (document.getElementById(phoenix.container)) {
        document.getElementById(phoenix.container).innerHTML = '<p><a href="http://www.adobe.com/go/getflashplayer"><img alt="Get Adobe Flash player" src="http://wwwimages.adobe.com/www.adobe.com/images/shared/download_buttons/get_flash_player.gif"></a></p>';
    }

    var xiSwfUrlStr = phoenix.flashVars.resourcePath + "playerProductInstall.swf";
    var swf = phoenix.flashVars.resourcePath + swf;
    // 此处使用replace将json字符串中的双引号，替换为单引号，是为了兼容ie浏览器给flash传参
    phoenix.flashVars['renderSizeOptions'] = JSON.stringify(phoenix._renderSizeOptions).replace(/\"/g, '\'');

    phoenix.flashVars['structItems'] = JSON.stringify(phoenix._structItems).replace(/\"/g, '\'');

    swfobject.embedSWF(swf, phoenix.container, "100%", phoenix._height,
        phoenix.flashplayerVersion, xiSwfUrlStr,
        phoenix.flashVars, phoenix.params, phoenix.attrs);
    swfobject.createCSS("#" + container, "display:block;");

    (function () {
        swfmacmousewheel.registerObject(phoenix.attrs.id);
    });

    // _beforeunloadInterval毫秒后监听window.onbeforeunload事件，提示用户保存设计数据
    if (phoenix._beforeunloadInterval >= 0) {
        setTimeout(function () {
            window.onbeforeunload = function (ev) {
                return "您正在离开在线家装设计软件, 请在离开此页前确定保存好您的设计！";
            }
        }, phoenix._beforeunloadInterval);
    }
};


/**
* 当窗口大小改变时
*/
window.onresize = function () {
    //swf设置最小宽度和最小高度：920x600
    phoenix._height = document.documentElement.clientHeight - phoenix._top;
    $("#" + phoenix.attrs.id).css("min-width", "920px");
    if (phoenix._height > 300) {
        $("#" + phoenix.attrs.id).height(phoenix._height);
    } else {
        $("#" + phoenix.attrs.id).height(300);
    }

};