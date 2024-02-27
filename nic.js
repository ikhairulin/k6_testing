// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check  } from 'k6'
import http from 'k6/http'
import { SharedArray } from 'k6/data'
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

export const options = {}

let jsonAuth = new SharedArray("auth", function() {
	return JSON.parse(open('./auth.json')).accs;
});


export default function main() {

  let loginInfo = randomItem(jsonAuth);

  const login = loginInfo.login
  const pass = loginInfo.pass
  console.log('Логин - ' + login)
  console.log('Пароль - ' + pass)

  let response
  let reg_token
  let compose_id

  group('page_1 - https://www.mail.nic.ru/', function () {
    response = http.get('https://www.mail.nic.ru/', {
      headers: {
        dnt: '1',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.post(
      'https://www.mail.nic.ru/app/v1/get/landing',
      '{"url":"messages-holiday"}',
      {
        headers: {
          'content-type': 'application/json;charset=utf-8',
          dnt: '1',
          referer: 'https://www.mail.nic.ru/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.options('https://mail.nic.ru/proxy/json_auth.php', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'https://www.mail.nic.ru',
        'sec-fetch-mode': 'cors',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    })

    const logData = {
      username: login,
      password: pass,
      host: "https://mail.nic.ru"
    };

    response = http.post(
      'https://mail.nic.ru/proxy/json_auth.php',
      JSON.stringify(logData),
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          dnt: '1',
          referer: 'https://www.mail.nic.ru/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
  })

  const checkAuth = response.json();

console.log(checkAuth)

  check(checkAuth, {
    'Authorization is successful': (s) => s.status === 'autorized',
  });


  group('page_2 - https://mail.nic.ru/roundcubemail/?_task=mail', function () {
    response = http.get('https://mail.nic.ru/roundcubemail/?_task=mail', {
      headers: {
        dnt: '1',
        referer: 'https://www.mail.nic.ru/',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    const regex = /"request_token":"(.*?)"/;
    const match = response.body.match(regex);

    if (match) {

        // defaultValue \"request_token\":\"rUITCDfdchwtX1Hlx6ETw14lkkxq5mJ2\"});
        reg_token = match[1];
        console.log('request_token is ' + reg_token);
    } else {
        console.log('Токен не найден');
    }

  check(reg_token, {
    'Token checked': (token) => {
        if (token) {
            return true;
        } else {
            return false;
        }
    }
});


    response = http.get(
      'https://mail.nic.ru/roundcubemail/?_task=mail&_action=list&_refresh=1&_layout=desktop&_mbox=INBOX&_remote=1&_unlock=loading1708966869690&_=1708966869537',
      {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          dnt: '1',
          referer: 'https://mail.nic.ru/roundcubemail/?_task=mail',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
          // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
          'x-roundcube-request': reg_token,
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://mail.nic.ru/roundcubemail/?_task=mail&_action=getunread&_page=1&_remote=1&_unlock=0&_=1708966869538',
      {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          dnt: '1',
          referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
          // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
          'x-roundcube-request': reg_token,
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )


    response = http.get(
      'https://mail.nic.ru/roundcubemail/?_task=mail&_action=set-token&_=1708966869539',
      {
        headers: {
          accept: '*/*',
          dnt: '1',
          referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest',
          // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
          'x-roundcube-request': reg_token,
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          // 'x-csrf-token': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
          'x-csrf-token': reg_token,
        },
      }
    )
  })

  const checktoken = response;
  console.log(checktoken.request.cookies.roundcube_sessid[0].value)

  check(checktoken, {
    'Last page_2 check': (s) => s.status === 200,
  });


  group(
    'page_3 - https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX&_action=compose',
    function () {
      response = http.get(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX&_action=compose',
        {
          headers: {
            dnt: '1',
            referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX',
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

      console.log(response.url)

      let regex = /_id=([a-zA-Z0-9]+)/;
      let match = response.url.match(regex);

      if (match) {
        // default ${compose_id}
        // 'https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}',
          compose_id = match[1];
          console.log('compose_id is ' + reg_token); // Вывод найденного токена
      } else {
          console.log('Токен не найден');
      }

    check(compose_id, {
      'Compose_id checked': (token) => {
          if (token) {
              return true;
          } else {
              return false;
          }
      }
  });

      response = http.get(
        'https://mail.nic.ru/roundcubemail/plugins/xframework/assets/bower_components/js-cookie/src/js.cookie.js?s=1690540835',
        {
          headers: {
            dnt: '1',
            referer:
              `https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}`,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

        response = http.post(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_action=autocomplete',
        {
          _search: 'шлр',
          _source: '',
          _reqid: '1708966875781',
          _remote: '1',
          _unlock: '0',
        },
        {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            dnt: '1',
            referer:
              `https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}`,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
            'x-roundcube-request': reg_token,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )


      response = http.post(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_action=autocomplete',
        {
          _search: 'ikhairu',
          _source: '',
          _reqid: '1708966878320',
          _remote: '1',
          _unlock: '0',
        },
        {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            dnt: '1',
            referer:
              `https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}`,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
            'x-roundcube-request': reg_token,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

      response = http.post(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_unlock=loading1708966902858&_framed=1',
        {
          // _token: '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
          _token: reg_token,
          _task: 'mail',
          _action: 'send',
          _id: compose_id,
          _attachments: '',
          _from: '6324393',
          _to: 'ikhairulin@gmail.com',
          _cc: '',
          _bcc: '',
          _replyto: '',
          _followupto: '',
          _subject: 'Тестовое письмо',
          editorSelector: 'html',
          _priority: '0',
          _store_target: 'Sent',
          _draft_saveid: '',
          _draft: '',
          _is_html: '1',
          _framed: '1',
          _message:
            '<p>Тестовое письмо № 5</p>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>\r\n<div id="_rc_sig">-- <br />\r\n<p style="margin: 0cm; margin-bottom: 0.0001pt; font-size: 11pt; font-family: Calibri,sans-serif;"><span>С уважением,</span></p>\r\n<p style="margin: 0cm; margin-bottom: 0.0001pt; font-size: 11pt; font-family: Calibri,sans-serif;"><span>Хайрулин Иван</span></p>\r\n<p style="margin: 0cm; margin-bottom: 0.0001pt; font-size: 11pt; font-family: Calibri,sans-serif;"><strong><em><span style="font-size: 12pt; color: #538135;">Quality Expert</span></em></strong></p>\r\n<p style="margin: 0cm; margin-bottom: 0.0001pt; font-size: 11pt; font-family: Calibri,sans-serif;"><span>Стажер-тестировщик</span></p>\r\n<p style="margin: 0cm; margin-bottom: 0.0001pt; font-size: 11pt; font-family: Calibri,sans-serif;"><em><span><span class="wmi-callto">+7 (963) 762-76-93</span></span></em></p>\r\n</div>',
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            dnt: '1',
            origin: 'https://mail.nic.ru',
            referer:
              `https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}`,
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
    }
  )

  let mailSendingCheck = response;

  check(mailSendingCheck, {
    'Email sent successfully': (s) => s.status === 200,
  });


  group(
    'page_4 - https://mail.nic.ru/roundcubemail/?_task=mail&_refresh=1&_mbox=INBOX&_page=',
    function () {
      response = http.get(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_refresh=1&_mbox=INBOX&_page=',
        {
          headers: {
            dnt: '1',
            referer:
              `https://mail.nic.ru/roundcubemail/?_task=mail&_action=compose&_id=${compose_id}`,
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

      response = http.get(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_action=list&_refresh=1&_layout=desktop&_mbox=INBOX&_remote=1&_unlock=loading1708966904106&_=1708966903879',
        {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            dnt: '1',
            referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_refresh=1&_mbox=INBOX&_page=',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
            'x-roundcube-request': reg_token,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://mail.nic.ru/roundcubemail/?_task=mail&_action=getunread&_page=1&_remote=1&_unlock=0&_=1708966903880',
        {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            dnt: '1',
            referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            // 'x-roundcube-request': '6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
            'x-roundcube-request': reg_token,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      })

  group(
    // 'page_5 - https://mail.nic.ru/roundcubemail/?_task=logout&_token=6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
    `page_5 - https://mail.nic.ru/roundcubemail/?_task=logout&_token=${reg_token}`,
    function () {
      response = http.get(
        // 'https://mail.nic.ru/roundcubemail/?_task=logout&_token=6WGiJ1hxy2bZrWPqNY0cY6Lh4BI8CsLo',
        `https://mail.nic.ru/roundcubemail/?_task=logout&_token=${reg_token}`,
        {
          headers: {
            dnt: '1',
            referer: 'https://mail.nic.ru/roundcubemail/?_task=mail&_mbox=INBOX',
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

    })

  // Automatically added sleep
  sleep(1)
}
