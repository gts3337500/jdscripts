const $ = new Env('建行生活');
const notify = $.isNode() ? require('./sendNotify') : '';
let AppId = '1472477795', giftMap = { "1": "打车", "2": "外卖", "3": "骑行" }, message = '';
let giftType = ($.isNode() ? process.env.JHSH_GIFT : $.getdata('JHSH_GIFT')) || '2';  // 奖励类型，默认领取'外卖'券
let bodyStr = ($.isNode() ? process.env.JHSH_BODY : $.getdata('JHSH_BODY')) || '';  // 签到所需的 body
let autoLoginInfo = ($.isNode() ? process.env.JHSH_LOGIN_INFO : $.getdata('JHSH_LOGIN_INFO')) || '';  // 刷新 session 所需的数据
let AppVersion = ($.isNode() ? process.env.JHSH_VERSION : $.getdata('JHSH_VERSION')) || '2.1.5.002';  // 最新版本号，获取失败时使用
let skipDay = ($.isNode() ? process.env.JHSH_SKIPDAY : $.getdata('JHSH_SKIPDAY')) || '';  // 下个断签日 (适用于借记卡用户)
let bodyArr = bodyStr ? bodyStr.split("|") : [];
let bodyArr2 = autoLoginInfo ? autoLoginInfo.split("|") : [];
$.is_debug = ($.isNode() ? process.env.IS_DEDUG : $.getdata('is_debug')) || 'false';

if (isGetCookie = typeof $request !== `undefined`) {
    $.msg("开始运行脚本")
    GetCookie();
    $.done();
}


// 获取签到数据
function GetCookie() {
    $.log($response.body);
    $.msg("开始替换变量")
    var response = JSON.parse(resp.body);
    response.data.MSPS_ENTITY[0].EFFECT_PERIOD_START = "20240326011000"
    $done({
        body: JSON.stringify(response) 
    })

}


// 刷新 session
async function autoLogin() {
    let opt = {
        url: `https://yunbusiness.ccb.com/clp_service/txCtrl?txcode=autoLogin`,
        headers: {
            'AppVersion': AppVersion,
            'Content-Type': `application/json`,
            'DeviceId': $.DeviceId,
            'Accept': `application/json`,
            'MBC-User-Agent': $.MBCUserAgent,
            'Cookie': ''
        },
        body: $.ALBody
    }
    debug(opt)
    return new Promise(resolve => {
        $.post(opt, async (error, response, data) => {
            try {
                let result = $.toObj(data) || response.body;
                // 如果数据未加密，则 session 未过期
                if (result?.errCode) {
                    // {"newErrMsg":"未能处理您的请求。如有疑问，请咨询在线客服或致电95533","data":"","reqFlowNo":"","errCode":"0","errMsg":"session未失效,勿重复登录"}
                    // $.token = $.getdata('JHSH_TOKEN');
                    console.log(`${result?.errMsg}`);
                } else {
                    const set_cookie = response.headers['set-cookie'] || response.headers['Set-cookie'] || response.headers['Set-Cookie'];
                    // !$.isNode() ? $.setdata($.token, 'JHSH_TOKEN') : '';  // 数据持久化
                    let new_cookie = $.toStr(set_cookie).match(/SESSION=([a-f0-9-]+);/);
                    if (new_cookie) {
                        $.token = new_cookie[0];
                        console.log(`✅ 刷新 session 成功!`);
                        debug(new_cookie);
                    } else {
                        message += `❌ 账号 [${$.info?.USR_TEL ? hideSensitiveData($.info?.USR_TEL, 3, 4) : $.index}] 刷新 session 失败，请重新获取Cookie。\n`;
                        console.log(`⛔️ 刷新 session 失败`);
                        debug(set_cookie);
                    }
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve()
            }
        });
    })
}


// 签到主函数
async function main() {
    let opt = {
        url: `https://yunbusiness.ccb.com/clp_coupon/txCtrl?txcode=A3341A115`,
        headers: {
            "Mid": $.info?.MID,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/CloudMercWebView/UnionPay/1.0 CCBLoongPay",
            "Accept": "application/json,text/javascript,*/*",
            "Cookie": $.token
        },
        body: `{"ACT_ID":"${$.info.ACT_ID}","REGION_CODE":"${$.info.REGION_CODE}","chnlType":"${$.info.chnlType}","regionCode":"${$.info.regionCode}"}`
    }
    debug(opt)
    return new Promise(resolve => {
        $.post(opt, async (err, resp, data) => {
            try {
                err && $.log(err);
                if (data) {
                    debug(data);
                    data = JSON.parse(data);
                    let text = '';
                    if (data.errCode == 0) {
                        text = `🎉 账号 [${$.info?.USR_TEL ? hideSensitiveData($.info?.USR_TEL, 3, 4) : $.index}] 签到成功`;
                        console.log(text);
                        message += text;
                        if (data?.data?.IS_AWARD == 1) {
                            // 更新自动断签日
                            if (skipDay >= 0) {
                                // 当 $.whichDay 等于 6 时，下一断签日修正为 0，否则 $.whichDay + 1
                                $.whichDay = $.whichDay == 6 ? 0 : $.whichDay + 1;
                                $.setdata(String($.whichDay), 'JHSH_SKIPDAY');
                                console.log(`♻️ 已更新断签配置：明天(${$.weekMap[$.whichDay]})将会断签`);
                            }
                            $.GIFT_BAG = data?.data?.GIFT_BAG;
                            $.GIFT_BAG.forEach(item => {
                                let body = { "couponId": item.couponId, "nodeDay": item.nodeDay, "couponType": item.couponType, "dccpBscInfSn": item.dccpBscInfSn };
                                if (new RegExp(`${giftMap[giftType]}`).test(item?.couponName)) {
                                    if (/信用卡/.test(item?.couponName)) {
                                        $.giftList.unshift(body);
                                    } else {
                                        $.giftList.push(body);
                                    }
                                } else {
                                    $.giftList2.push(body);
                                }
                            })
                            $.giftList = [...$.giftList, ...$.giftList2];
                        } else if (data?.data?.NEST_AWARD_DAY >= 1) {
                            text = `继续签到${data.data.NEST_AWARD_DAY}天可领取${giftMap[giftType]}券`;
                            message += `，${text}\n`;
                            console.log(text);
                        } else {
                            console.log(`暂无可领取的奖励`);
                            message += "\n";
                        }
                    } else {
                        console.log(JSON.stringify(data));
                        text = `❌ 账号 [${$.info?.USR_TEL ? hideSensitiveData($.info?.USR_TEL, 3, 4) : $.index}] 签到失败，${data.errMsg}\n`;
                        console.log(text);
                        message += text;
                    }
                } else {
                    $.log("服务器返回了空数据");
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        })
    })
}


// 领取奖励
async function getGift() {
    let opt = {
        url: `https://yunbusiness.ccb.com/clp_coupon/txCtrl?txcode=A3341C082`,
        headers: {
            "Mid": $.info?.MID,
            "Content-Type": "application/json;charset=utf-8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/CloudMercWebView/UnionPay/1.0 CCBLoongPay",
            "Accept": "application/json,text/javascript,*/*"
        },
        body: `{"mebId":"${$.info.MEB_ID}","actId":"${$.info.ACT_ID}","nodeDay":${$.nodeDay},"couponType":${$.couponType},"nodeCouponId":"${$.couponId}","dccpBscInfSn":"${$.dccpBscInfSn}","chnlType":"${$.info.chnlType}","regionCode":"${$.info.regionCode}"}`
    }
    debug(opt);
    return new Promise(resolve => {
        $.post(opt, async (err, resp, data) => {
            try {
                err && $.log(err);
                if (data) {
                    debug(data);
                    data = JSON.parse(data);
                    if (data.errCode == 0) {
                        $.isGetGift = true;
                        $.getGiftMsg = `获得签到奖励：${data?.data?.title}（${data?.data?.subTitle}）\n`;
                        console.log($.getGiftMsg);
                    } else {
                        $.continue = true;
                        console.log(JSON.stringify(data));
                    }
                } else {
                    $.log("服务器返回了空数据");
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        })
    })
}


// 获取最新版本
async function getLatestVersion() {
    let opt = {
        url: `https://itunes.apple.com/cn/lookup?id=${AppId}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
    return new Promise(resolve => {
        $.get(opt, async (err, resp, data) => {
            try {
                err && $.log(err);
                if (data) {
                    try {
                        let result = JSON.parse(data);
                        const { trackName, bundleId, version, currentVersionReleaseDate, } = result.results[0];
                        AppVersion = version;
                        !$.isNode() ? $.setdata(AppVersion, 'JHSH_VERSION') : '';  // 数据持久化
                        console.log(`版本信息: ${trackName} ${version}\nBundleId: ${bundleId} \n更新时间: ${currentVersionReleaseDate}`);
                    } catch (e) {
                        $.log(e);
                    };
                } else {
                    console.log(`版本信息获取失败\n`);
                }
            } catch (error) {
                $.log(error);
            } finally {
                resolve();
            }
        })
    })
}


/**
 * 对象属性转小写
 * @param {object} obj - 传入 $request.headers
 * @returns {object} 返回转换后的对象
 */
function ObjectKeys2LowerCase(obj) {
    const _lower = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
    return new Proxy(_lower, {
        get: function (target, propKey, receiver) {
            return Reflect.get(target, propKey.toLowerCase(), receiver)
        },
        set: function (target, propKey, value, receiver) {
            return Reflect.set(target, propKey.toLowerCase(), value, receiver)
        }
    })
}


// 数据脱敏
function hideSensitiveData(string, head_length = 2, foot_length = 2) {
    let star = '';
    try {
        for (var i = 0; i < string.length - head_length - foot_length; i++) {
            star += '*';
        }
        return string.substring(0, head_length) + star + string.substring(string.length - foot_length);
    } catch (e) {
        console.log(e);
        return string;
    }
}


// DEBUG
function debug(content, title = "debug") {
    let start = `\n----- ${title} -----\n`;
    let end = `\n----- ${$.time('HH:mm:ss')} -----\n`;
    if ($.is_debug === 'true') {
        if (typeof content == "string") {
            console.log(start + content + end);
        } else if (typeof content == "object") {
            console.log(start + $.toStr(content) + end);
        }
    }
}


// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } isShadowrocket() { return "undefined" != typeof $rocket } isStash() { return "undefined" != typeof $environment && $environment["stash-version"] } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, a] = i.split("@"), n = { url: `http://${a}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), a = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(a); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { if (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) }); else if (this.isQuanX()) this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t && t.error || "UndefinedError")); else if (this.isNode()) { let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: i, statusCode: r, headers: o, rawBody: a } = t, n = s.decode(a, this.encoding); e(null, { status: i, statusCode: r, headers: o, rawBody: a, body: n }, n) }, t => { const { message: i, response: r } = t; e(i, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) }); else if (this.isQuanX()) t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t && t.error || "UndefinedError")); else if (this.isNode()) { let i = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...o } = t; this.got[s](r, o).then(t => { const { statusCode: s, statusCode: r, headers: o, rawBody: a } = t, n = i.decode(a, this.encoding); e(null, { status: s, statusCode: r, headers: o, rawBody: a, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && i.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, i = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": i } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), this.isSurge() || this.isQuanX() || this.isLoon() ? $done(t) : this.isNode() && process.exit(1) } }(t, e) }
