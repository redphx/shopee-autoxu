const ALARM_NAME = 'checkin';
const PERIOD_IN_MINUTES = 60;

function onSuccess(coins) {
  chrome.notifications.create({
    type: 'basic',
    title: 'AutoXu for Shopee',
    iconUrl: 'img/icon-128.png',
    message: 'Đã nhận thành công ' + coins + ' Xu của hôm nay',
  });

  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: PERIOD_IN_MINUTES,
  });
}

function redeemCoins() {
  console.log('redeemCoins', Date());

  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://shopee.vn/mkt/coins/api/v1/checkin_v2/', true);
  xhr.responseType = 'json';
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      let json = xhr.response;
      if (json.success) {
        let coins = parseInt(json['increase_coins']);
        onSuccess(coins);

        console.log('Redeemed');
      } else {
        console.log('Already redeemed');
      }
    }
  }
  xhr.send();
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    redeemCoins();
  }
})

redeemCoins();