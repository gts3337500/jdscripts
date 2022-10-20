/* eslint-disable */
/*

*/


const $ = new Env('京东热爱穿行记_膨胀');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.CryptoJS = require('crypto-js')
let GetRisk = ''

$.joyytoken = "";
let joyytoken_count = 0

$.token = process.env.gua_racxj_token || token // token
let outuserIdArr = [];
let outuserID = '';// 屏蔽账号 2,5,7
if ($.isNode() && process.env.jd_racxj_outuserID) {
  outuserID = process.env.jd_racxj_outuserID;
}
for(let i of outuserID && outuserID.split(',')){
  outuserIdArr.push(i)
}

$.inviteIdArr = "" // 助力码 @ 隔开

if ($.isNode() && process.env.jd_racxj_inviteIdArr_expand) {
  $.inviteIdArr = process.env.jd_racxj_inviteIdArr_expand;
}
$.functionCode = 'promote'
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.secretpInfo = {};
$.ShInviteList = [];
$.innerShInviteList = [];
$.getTeam = false
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
if($.inviteIdArr.indexOf('@') > -1){
  $.inviteIdArr = $.inviteIdArr.split('@')
  for(i of $.inviteIdArr){
    $.inviteList.push({
      'inviteId': i,
      'max': false
    });
  }
}else if($.inviteIdArr){
  $.inviteList.push({
    'inviteId': $.inviteIdArr,
    'max': false
  });
  $.inviteIdArr = [$.inviteIdArr]
}else{
  $.inviteIdArr = []
}
$.appid = 'o2_act';
$.UA = ''
$.UUID = ''
let utils = ''

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  if(!$.token){
    console.log("填写log token[gua_racxj_token]")
    return
  }
  let urlArr = [
    // "http://127.0.0.1",
    "https://jd.smiek.tk",
    "http://jd.smiek.ga",
  ]
  $.getSignUrl = urlArr[0]
  if(!GetRisk){
    for(let i of urlArr){
      $.getSignUrl = i
      await toStatus()
      if($.toStatus) break
    }
    if(!$.toStatus){
      console.log($.getSignErr)
      console.log(`无法连接服务器，请检查网络`)
      console.log(`多次请求都无法连接服务器地址：${urlArr[0]}，请添加到代理`)
      return
    }
  }
  if($.inviteIdArr.length == 0){
    $.getTeam = true
  }
  console.log(`您屏蔽的账号是${outuserID}`)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.index = i + 1;
      let out = false
      for(let c of outuserIdArr){
          if(c == $.index) {
              out = true
              break
          }
      }
      if(out) continue
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      $.joyytoken = ''
      joyytoken_count = 0
      getUA()
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      await run()
      if(!$.inviteIdFlag) break
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }
})()
  .catch((e) => {
    $.log(`❌ ${$.name}, 失败! 原因:`)
    console.log(e)
  })
  .finally(() => {
    $.done();
  })

async function run() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    $.userInfo = ''
    $.mpin = ''
    $.canHelp = true
    let flag = false
    await takePostRequest($.functionCode+'_pk_getHomeData');
    if($.hotFlag) return
    $.inviteIdFlag = false
    if($.inviteList.length > 0 && !$.getTeam){
      for (let j = 0; j < $.inviteList.length && $.canHelp && !$.hotFlag; j++) {
        $.oneInviteInfo = $.inviteList[j];
        $.inviteId = $.oneInviteInfo.inviteId || '';
        if ($.oneInviteInfo.max || $.inviteId == '') {
          continue;
        }
        $.inviteIdFlag = true
        console.log("准备助力",$.inviteId)
        await takePostRequest('help');
      }
    }
    $.getTeam = false
    await $.wait(getRndInteger(1000, 1500));
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case $.functionCode+'_pk_getHomeData':
      if($.inviteId){
        body = `functionId=${type}&client=m&clientVersion=-1&appid=signed_wh5&body={"inviteId":"${$.inviteId}"}`;
      }else{
        body = `functionId=${type}&client=m&clientVersion=-1&appid=signed_wh5&body={}`;
      }
      myRequest = await getPostRequest(type, body);
      break;
    case 'help':
      body = await getPostBody(type);
      myRequest = await getPostRequest($.functionCode+'_pk_collectPkExpandScore', body);
      break;
    default:
      console.log(`错误${type}`);
  }
  if (myRequest) {
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          dealReturn(type, data);
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
}


async function dealReturn(type, res) {
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.log(`返回异常：${res}`);
    return;
  }
  switch (type) {
    case 'collectFriendRecordColor1':
    case 'collectFriendRecordColor2':
    case 'help_home':
      break
    case 'getEncryptedPinColor':
      if (data.bcode == 200 && data.result) {
        $.mpin = data.result
      }
      break
    case $.functionCode+'_pk_getHomeData':
      if (data.code === 0 && data.data && data.data.result) {
        if (data.data['bizCode'] === 0) {
          $.secretp = data.data.result.secretp;
        }
      } else if (data.data && data.data.bizMsg) {
        if(data.data.bizCode === -1001){
          $.hotFlag = true;
        }
        console.log(data.data.bizMsg);
      } else {
        if (data.code == -30001) {
          $.hotFlag = true;
        }
        console.log(res);
      }
      break;
    case 'help':
      if (data.code === 0 && data.data ) {
        switch (data.data.bizCode) {
          case 0:
            console.log(`助力成功(${data.data.result.times}/${data.data.result.maxTimes})`);
            break;
          case -19:
            console.log(`助力已满`);
            $.oneInviteInfo.max = true;
            break;
          case -9:
            $.canHelp = false;
          case -15:
          case 104:
          case -3:
          case -13:
            console.log(data.data.bizMsg);
            break;
          case -1002:
            console.log(`助力失败：${JSON.stringify(data)}`);
            $.canHelp = false;
            break;
          default:
            console.log(`助力失败：${JSON.stringify(data)}`);
        }
      }else{
        console.log(`助力失败：${JSON.stringify(data)}`);
      }
      break;
    default:
      console.log(`未判断的异常:${type}\n${res}`);
  }
}

async function getPostBody(type) {
  return new Promise(async resolve => {
    let taskBody = ''
    try {
      var log = ''
      var uuid = ``;
      if(type == 'help'){
        taskBody = `functionId=promote_pk_collectPkExpandScore&client=m&clientVersion=-1&appid=signed_wh5&body=${JSON.stringify(await getLogs(type, { "actionType":"0","inviteId":$.inviteId}))}`;
      }else{
        taskBody = `functionId=${type}&client=m&clientVersion=-1&appid=signed_wh5&body=${JSON.stringify(await getLogs(type, { "actionType":"0","inviteId":$.inviteId}))}`;
      }
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(taskBody);
    }
  })
}

async function getLogs(functionId,body = {}){
  let num = ''
  let log = ''
  let res = ''
  let joyytoken = ''
  if(!$.joyytoken){
    joyytoken = await gettoken()
  }else{
    joyytoken = $.joyytoken
  }
  let resBody = {"fn":"racxj","id":functionId,"riskData":'',"pin":$.UserName,"joyytoken":joyytoken,"uid":$.uid || ""}
  if(GetRisk){
    res = await GetRisk.getBody(resBody)
  }else{
    let log_res = await getLog(resBody)
    res = log_res.data
    let resCount = 0
    while (!res && resCount <= 4) {
      resCount++
      console.log(`重新获取算法 第${resCount}次`)
      log_res = await getLog(resBody)
      res = log_res.data
    }
  }
  if(!res){
    console.log('获取不到算法')
    process.exit(1)
  }
  if(res.joyytoken){
    $.joyytoken = res.joyytoken
  }
  if(res.ua){
    $.UA = res.ua
  }
  if(res.uid){
    $.uid = res.uid
  }
  log = res.log || -1
  num = res.random || ''
  return {
    ...body,
    "random": num,
    "log": log,
  }
}
//log算法
async function getLog(body) {
  return new Promise(resolve => {
    let options = {
      url: `${$.getSignUrl}/jdlog`,
      body: JSON.stringify({ "token": $.token, "body": body }),
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000
    }
    let msg = ''
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 算法 API请求失败，请检查网路重试`)
        } else {
          data = $.toObj(data, data);
          if (data && data.code && data.code == 200) {
            msg = data
            if (data.msg && data.msg != "success"){
              console.log(data.msg)
              if(/token剩余次数：0/.test(data.msg)) process.exit(1)
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve(msg);
      }
    })
  })
}
function toStatus() {
  return new Promise(resolve => {
    let get = {
      url: `${$.getSignUrl}/to_status`,
      timeout: 10000
    }
    $.get(get, async (err, resp, data) => {
      try {
        if (err) {
          $.getSignErr = err
          // console.log(`${$.toStr(err)}`)
          // console.log(`${$.name} 连接服务器 API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data, data)
          if (res && typeof res == 'object') {
            if (res.msg === "success") {
              $.toStatus = true
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function gettoken() {
  return new Promise(resolve => {
    opts = {
      url: `https://rjsb-token-m.jd.com/gettoken`,
      headers: {
          "accept": "*/*",
          "Origin": "https://bunearth.m.jd.com",
          "Referer": "https://bunearth.m.jd.com/",
          "User-Agent": $.UA,
      },
      body:`content={"appname":"50168","whwswswws":"","jdkey":"a","body":{"platform":"1"}}`
    }
    let msg = ''
    $.post(opts, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err, err)}`)
          console.log(`gettoken API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data,data);
          if(typeof res == 'object'){
            if(res.joyytoken){
              msg = res.joyytoken
            }else{
              console.log(data)
            }
          }else{
            console.log(data)
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve(msg);
      }
    })
  })
}
async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/${type && 'client.action?functionId='+type || ''}`;
  const method = `POST`;
  let cookies = $.cookie.replace(/;([^\s])/g, '; $1')
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': `${$.joyytoken && 'joyytokem=50168'+$.joyytoken+'; ' || ''}${cookies} pwdt_id=${encodeURIComponent($.UserName)};${$.uid ? ' sid='+$.uid+';' : ''}`,
    "Origin": "https://bunearth.m.jd.com",
    "Referer": "https://bunearth.m.jd.com/babelDiy/Zeus/3rFiv8Sdkn7BPhk8Pw8xrgMWH6mT/index.html",
    "User-Agent": $.UA,
  };
  headers.Cookie = headers.Cookie.replace(/;$/,'')
  return {url: url, method: method, headers: headers, body: body, timeout:30000};
}

function getUA(){
  $.uid = $.CryptoJS.SHA1($.UserName).toString()
  $.UA = `jdapp;iPhone;10.1.4;14.3;${$.uid};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}


function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
 function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 随机数
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
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

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
