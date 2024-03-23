

[rewrite_local]

# > 拦截100解锁超级会员
^https:\/\/yunbusiness\.ccb\.com\/clp_service\/txCtrl\?txcode=[A-Za-z0-9]+$ url script-response-body https://raw.githubusercontent.com/gts3337500/jdscripts/main/test.js

[mitm] 
hostname = yunbusiness.ccb.com

var response = JSON.parse($response.body);

// 替换VERNAME字段的值为"202403231001"
response.data.VERNAME = "202403231001";

$done({
  body: JSON.stringify(response)
});
