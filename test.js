var response = JSON.parse($response.body);

// 替换VERNAME字段的值为"202403231001"
response.data.VERNAME = "202403231001";

$done({
  body: JSON.stringify(response)
});
