// /src/flux/service.js
// Description:
// "service.js"
// Copyright 2018-2020 NOOXY. All Rights Reserved.
import Constants from './constants.json';
import Localizes from './data/localizes.json';

function Service(IoTAPI, Dispatcher) {
  let _iot_api;

  // let iottalk_endpoint = 'https://7.iottalk.tw';
  let iottalk_endpoint = localStorage.getItem('endpoint');

  function Dummy_Sensor() {
    return Math.random();
  }

  function Dummy_Control(data) {}


  let setupOnline = () => {
    try {
      _iot_api = new IoTAPI({
        'dm_name': 'Remote_control',
        'idf_list': ['Keypad1', 'Button1', 'Switch1', 'Knob1'],
        'odf_list': [],
        'd_name': undefined,
      }, iottalk_endpoint);
      _iot_api.register((e, profile)=> {
        if(e) {
          alert('Occured error: \n'+e.toString()+'\nCheck your settings and environment is set properly.');
        }
        console.log(e);
        console.log(profile);
        document.title = profile.d_name;
        this.Actions.updateIoTtalkProfile(profile);
        setInterval(
          ()=>{
            // _iot_api.getSelectedDfs((err, re)=> {
            //   console.log(re);
            // });
            // _iot_api.pull('__Ctl_O__', (err, data)=> {
            //   console.log(err, data);
            // });
          }, 1000);
      });
      window.IoTAPI = _iot_api;

    } catch (e) {
      console.log(e);
      setTimeout(setupOnline, 15 * 1000);
    }
  };

  this.Actions = {
    updateLang: (lang) => {
      Dispatcher.dispatch({
        type: 'updateLang',
        data: lang
      });
    },
    updateControls: ()=> {
      _iot_api.getSelectedDfs((err, re)=> {
        Dispatcher.dispatch({
          type: 'updateControls',
          data: re
        });
      });
    },
    updateIoTtalkProfile: (data) => {
      Dispatcher.dispatch({
        type: 'updateIoTtalkProfile',
        data: data
      });
    },
    updateLocalizes: (data) => {
      Dispatcher.dispatch({
        type: 'updateLocalizes',
        data: data
      });
    },
    updateUserMeta: (data) => {
      Dispatcher.dispatch({
        type: 'updateUserMeta',
        data: data
      });
    },
    updateDarktheme: (data) => {
      Dispatcher.dispatch({
        type: 'updateDarktheme',
        data: data
      });
      localStorage.setItem('DarkTheme', data);
    },
    updateEndpoint: (data) => {
      Dispatcher.dispatch({
        type: 'updateEndpoint',
        data: data
      });
      localStorage.setItem('endpoint', data);
      document.location.reload();
    },
    log: (title, data) => {
      console.log('[' + title + '] ' + data)
    }
  };

  this.start = (next) => {
    this.Actions.updateLang('en');
    this.Actions.updateLocalizes(Localizes);
    this.Actions.updateDarktheme(localStorage.getItem('DarkTheme'));
    Dispatcher.dispatch({
      type: 'updateEndpoint',
      data: iottalk_endpoint
    });
    setupOnline();
  }
}

export default Service;
