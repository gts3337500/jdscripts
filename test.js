$.msg("开始替换变量")
var response = JSON.parse(resp.body);
response.data.MSPS_ENTITY[0].EFFECT_PERIOD_START = "20240326011000"

$done({
  body: JSON.stringify(response)
});
