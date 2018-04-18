
//============ 后台地址 ================
var urlRequst = "https://pingan.izzhk.com:8081/";//开发外网server环境服务器
var urlRequstNo = "https://www.izzhk.com/SCA/";//SCA规则管理页面嵌套URL
var WSURL = "wss://pingan.izzhk.com:8081/";//server服务器
var SampleRate = 16000;//采样率




//talk_record聊天框高度自适应      .form_login登录页高度
$(".form_login").css("height",($(window).height()-100)+"px"); 

/*
 * 封装AJAX请求
 * 
 * requstType 请求方式
 * url 请求路径
 * data 请求参数
 * callbackFunction 回调函数
 * 
 */
ajaxRequst = function (requstType,url,data,callbackFunction){
		var loginFlag = sessionStorage.getItem("loginFlag");
		
		if("1" != loginFlag && "auth/login" != url){
			window.location.href = "login.html";
		}else{
			$.ajax( {
			type : requstType,
			url : urlRequst + url,
			data : data,
			crossDomain:true,
    		xhrFields: {  withCredentials: true  },
			success : function(data) {
				
				if("12" == data.code){
					alert(data.message);
					window.location.href = "login.html";
					
					return
				}
				//回调函数
				callbackFunction(data);
			},
			error : function(data) {
				
				//请求失败构造参数
				var data = {
					code:"11",
					data:null,
					message:"服务器请求失败"
				}
				
				//回调函数
				callbackFunction(data);
			}
		});
		}
		
}


/*
 * 非空校验
 * null
 * ""
 * undefined
 * "null"
 */
function isNull(temp){
    if(0 == temp || "0" == temp){
        return true;
    }else if("" != temp && null != temp && undefined != temp && "null" != temp){
        return true;
    }
    return false;
}


/*
 * 返回非空校验
 * null
 * ""
 * undefined
 * "null"
 */
function returnIsNull(temp){
	if(0 == temp || "0" == temp){
		return temp;
	}else if("" != temp && null != temp && undefined != temp && "null" != temp && NaN != temp){
		return temp;
	}
	return "";
}


/*
 *设置等级
 * 经验值
 * 等级名称
 */
function setLevel(data){
	
	sessionStorage.setItem("levelUp",data.levelUp);//是否升级
	sessionStorage.setItem("experienceLevel",data.experienceLevel);//等级
	sessionStorage.setItem("experienceValue",data.experienceValue);//经验值
	sessionStorage.setItem("levelName",data.levelName);//等级名称
	sessionStorage.setItem("isFirstPait","0");//是否第一次展示
	sessionStorage.setItem("totalTrainTime",data.totalTrainTime);//登陆总时长
	sessionStorage.setItem("trainCount",data.trainCount);//登陆总次数
	sessionStorage.setItem("roleName",data.roleName);//登陆总次数
	sessionStorage.setItem("trainQuestionWaitTime",data.trainQuestionWaitTime);//模拟训练时问题问完间隔时间
	sessionStorage.setItem("trainConversationWaitTime",data.trainConversationWaitTime);//模拟训练时回答时中间时间间隔
	sessionStorage.setItem("headImagePath",data.headImagePath);//头像
	sessionStorage.setItem("userName",data.userName);//姓名
	
	
	
}


 //返回上一页
		$(".backOriginalpage").click(function(){
			window.history.go(-1);//返回上一页不刷新
			window.location.href = document.referrer;//返回上一页并刷新
		}) 