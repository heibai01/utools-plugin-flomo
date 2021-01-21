'use strict';

const { utools } = window;
const axios = require('axios');

window.exports = {
  'setapi': {
    mode: 'list',
    args: {
      enter: () => {
        utools.subInputFocus();
      },
      search:  (action, searchWord, callbackSetList) => {
        callbackSetList([
          {
             title: '确定',
             description: '设置 Flomo API',
             icon: 'icons/setapi.png',
             urlWithToken: searchWord,
          }
       ]);
      },
      select: (action, itemData, callbackSetList) => {
        const api = utools.db.get('api');
        const data = {
          _id: 'api',
          urlWithToken: itemData.urlWithToken,
        };
        if (api) {
          data._rev = api._rev;
        }
        utools.db.put(data);
        utools.hideMainWindow();
        utools.showNotification('设置专属记录 API 成功！');
        utools.outPlugin();
      },
      placeholder: "输入"
    }
  },
  'sendto_by_text': {
    mode: 'none',
    args: {
      enter: (action, callbackSetList) => {
        utools.hideMainWindow();
        const api = utools.db.get('api');
        if (api) {
          const { payload } = action;
          axios.post(api.urlWithToken, {
            content: payload,
          })
          .then(function (response) {
            if (response.data && response.data.code === -1) {
              utools.showNotification('发送失败！请检查API是否正确？');
            } else {
              utools.showNotification('发送成功！');
            }
          })
          .catch(function (error) {
            utools.showNotification('未知错误！');
          });
        } else {
          utools.showNotification('请先设置专属记录 API！');
        }
        utools.outPlugin();
      },
    }
  },
  // 'sendto_by_img': {
  //   mode: 'none',
  //   args: {
  //     enter: (action, callbackSetList) => {},
  //     select: (action, itemData) => {}
  //   }
  // }
}