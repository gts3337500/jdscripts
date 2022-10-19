/*
元宝阅读【元宝阅读】
看文章赚零花钱，全新玩法，提现秒到 http://pcloeo.cn/coin/index.html?mid=2B6YUCY6B&1665980307993

抓包域名 http://mr.meizuanxp.cn/api/coin/info
查看请求体的的un和token值
变量为ybydck='un值&token值'
多账号换行隔开  
定时自己感觉
*/

const $ = new Env('元宝阅读');
var request = require("request");
let status;
status = (status = ($.getval("ybstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
let ybydckArr = [],ybcount = ''
const notify = $.isNode() ? require('./sendNotify') : '';
let ybydck= $.isNode() ? (process.env.ybydck ? process.env.ybydck : "") : ($.getdata('ybydck') ? $.getdata('ybydck') : "")
let allMessage = '';
let ybydcks = ""
const logs =0;
const host='http://mr.didava.cn/api/coin/'
var timestamp = new Date().getTime()
!(async () => {
  if (typeof $request !== "undefined") {
        
  } else {
      if(!$.isNode()){
          ybydckArr.push($.getdata('ybydck'))
          let ybcount = ($.getval('ybcount') || '1');
          for (let i = 2; i <= ybcount; i++) {
            ybydckArr.push($.getdata(`ybydck${i}`))
            }
    console.log(`------------- 共${ybydckArr.length}个账号-------------\n`)
      for (let i = 0; i < ybydckArr.length; i++) {
        if (ybydckArr[i]) {
          ybydck = ybydckArr[i];
          $.index = i + 1;

  }
}
      }else  {
          if (process.env.ybydck && process.env.ybydck.indexOf('\n') > -1) {
            ybydckArr = process.env.ybydck.split('\n');
        } else {
            ybydcks = [process.env.ybydck]
        };
        Object.keys(ybydcks).forEach((item) => {
        if (ybydcks[item]) {
            ybydckArr.push(ybydcks[item])
        }
    })
          console.log(`共${ybydckArr.length}个cookie`)
	        for (let k = 0; k < ybydckArr.length; k++) {
                $.message = ""
                ybydck = ybydckArr[k]
                $.index = k + 1;
				un = ybydck.split('&')[0]
				token = ybydck.split('&')[1]
          console.log(`\n开始【账号${$.index}】`)
            await info()
            await $.wait(2000)
			await statAccess()


}
      }
  }
  if ($.isNode() && allMessage) {
      await notify.sendNotify(`${$.name}`, `${allMessage}` )
    }

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

  function info() {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`info`,`{"un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
				ids=data.result.uid
                console.log(`\n用户：${ids} \n积分：${data.result.moneyCurrent}\n今日还可刷：${data.result.leftCount}篇文章`)
				ids=data.result.uid
				jfye=data.result.moneyCurrent
				await statAccess()
				await $.wait(2000)
				await read()
				await $.wait(10000)
				await submit(ids)
				await $.wait(1000)
				await statAccess()
				await $.wait(2000)
				await info3()
				await $.wait(2000)
				await statAccess()
				await $.wait(2000)
				if(jfye >= 3000 && jfye <= 4999){
					txje=3000
					console.log(`\n开始提现`)

					await tx(txje)
				  }else if(jfye >= 5000 && jfye <= 9999){
					txje=5000
					console.log(`\n开始提现`)

					await tx(txje)
			  }else if(jfye >= 10000 && jfye <= 49999){
				txje=10000
				console.log(`\n开始提现`)

				await tx(txje)
		       }else if(jfye >= 50000 ){
				txje=50000
				console.log(`\n开始提现`)

				await tx(txje)
		       } else if(data.result.moneyCurrent <= 2999){
				console.log(`\n余额不足，不执行提现`)
			  }

}else {
	console.log(`\nck错误`)
}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }


   function info2(a) {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`info`,`{"un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
				idhh=data.result.uid
				await statAccess()
				await $.wait(2000)
			for (let x = 0; x < `${a}`; x++) {
						$.index = x + 1
			
				await read1()
				await $.wait(20000)
			
				await submit1(idhh)
				await $.wait(20000)
					}
				
}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   function info3() {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`info`,`{"un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
				idsse=data.result.uid
				console.log(`\n用户：${idsse} \n积分：${data.result.moneyCurrent}`)
			
				
				
}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   //状态
   function statAccess() {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`statAccess`,`{"token":"${token}","pageSize":20,"un":"${un}"}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data){

				console.log(`\n状态刷新：${data.msg}`)
			
				
				
}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   function tx(a) {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`wdmoney`,`{"val":${a},"un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
                console.log(`\n提现${(a)/10000}:${data.msg}`)

}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   function read() {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`read`,`{"code":"fx1","url":"http://mr.meizuanxp.cn/coin/h.html","un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
                console.log(`\n观看文章：${data.result.url}，等待10~20秒`)

}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   function submit(a) {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`submit`,`{"code":"${a}","un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
				console.log(`\n注：后面如果有地方报错可能是账号今日黑了，明日在执行，也可能是距离上次执行间隔没超过1小时`) 
				lqxy=data.result.val
				console.log(`\n积分领取：${lqxy}，等待10~20秒 `)            

				ydcs=data.result.progress
					
				
	
						await $.wait(20000)
				
						await info2(ydcs)
						await $.wait(10000)

				

				
}

				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }

   function read1() {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`read`,`{"code":"fx1","url":"http://mr.meizuanxp.cn/coin/h.html","un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
                console.log(`\n观看文章：${data.result.url}，等待10~20秒`)

}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
   function submit1(a) {
	return new Promise((resolve) => {
	 
   $.post(ybydpost(`submit`,`{"code":"${a}","un":"${un}","token":"${token}","pageSize":20}`), async (err, resp, data) => {
		 
		 try {
			if (err) {
				console.log(`${JSON.stringify(err)}`)
				console.log(`${$.name} API请求失败，请检查网路重试`)
			  }// else {
				if (safeGet(data)) {
				  data = JSON.parse(data);
				   
			if(data.code == 0){
				
                console.log(`\n领取积分：${data.result.val}成功，等待10~20秒`)

}
else  {console.log(`\n参数错误`)}
				
				}
		   
		 } catch (e) {
		   $.logErr(e, resp)
		 } finally {
		   resolve(data);
		 }
	   })
	 })
   }
function ybydpost(a,b) {
  return {

    url: `${host}${a}`,
    body: `${b}`,
    headers: {
		"Host": "mr.meizuanxp.cn",
		"Origin": "http://mr.meizuanxp.cn",
		"Content-Type": "application/json; charset=utf-8",
		"Accept-Language": "zh-CN,zh-Hans;q=0.9",
		"Accept-Encoding": "gzip, deflate",
		"Connection": "keep-alive",
		"Accept": "application/json, text/javascript, */*; q=0.01",
		"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2f) NetType/4G Language/zh_CN",
		"Referer": `http://mr.meizuanxp.cn/coin/index.html?mid=2B6YUCY6B&ft=${timestamp}&${timestamp}`,
		"Content-Length": "94",
		"X-Requested-With": "XMLHttpRequest"
	  }
  }
}


function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
