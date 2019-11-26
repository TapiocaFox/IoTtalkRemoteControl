/**
 * @file IoTtalk version 1 JavaScript library
 * @author noowyee <magneticchen@gmail.com>
 * @copyright 2019-2020 NOOXY. All Rights Reserved.
 */

/**
 * @name CSMAPI - Communication SubModule system API
 * @class
 * @constructor
 * @param {string} endpoint
 */
function CSMAPI(ENDPOINT) {
  /**
   * @member {string} _ENDPOINT
   * @private
   */
  this._ENDPOINT = ENDPOINT;
  /* ... */
};

/**
 * @name register
 * @memberof CSMAPI
 * @function
 * @param {string} mac_addr
 * @param {object} profile
 * @param {callback} callback
 */
CSMAPI.prototype.register = function(mac_addr, profile, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onload = function(e) {
    if (this.readyState === 4 && this.status === 200) {
      let result = JSON.parse(this.responseText);
      if (callback) {
        callback(false, result.d_name, result.password);
      }
    } else if (this.readyState === 4) {
      if (callback) {
        callback(new Error('Http status '+this.status.toString()));
      };
    }
  };
  xhttp.onerror = function(e) {
    if (callback) {
      callback(e);
    }
  }
  xhttp.open('POST', this._ENDPOINT + '/' + mac_addr, true);
  xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhttp.send(JSON.stringify({
    'profile': profile
  }));
}

/**
 * @name deregister
 * @memberof CSMAPI
 * @function
 * @param {string} mac_addr
 * @param {callback} callback
 */
CSMAPI.prototype.deregister = function(mac_addr, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
      let result = JSON.parse(this.responseText);
      if (callback) {
        callback(false);
      }
    } else if (this.readyState === 4) {
      if (callback) {
        callback(new Error('Http status '+this.status.toString()));
      };
    }
  };
  xhttp.onerror = function(e) {
    if (callback) {
      callback(e);
    }
  }
  xhttp.open('DELETE', this._ENDPOINT + '/' + mac_addr, true);
  xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhttp.send();
}

/**
 * @name pull
 * @memberof CSMAPI
 * @function
 * @param {string} mac_addr
 * @param {string} password
 * @param {string} odf_name
 * @param {callback} callback
 */
CSMAPI.prototype.pull = function(mac_addr, password, odf_name, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
      let result = JSON.parse(this.responseText);
      if (callback) {
        callback(false, result['samples']);
      }
    } else if (this.readyState === 4) {
      if (callback) {
        callback(new Error('Http status '+this.status.toString()));
      };
    }
  };
  xhttp.onerror = function(e) {
    if (callback) {
      callback(e, []);
    }
  }
  xhttp.open('GET', this._ENDPOINT + '/' + mac_addr + '/' + odf_name, true);
  xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhttp.setRequestHeader("password-key", password);
  xhttp.send();
}

/**
 * @name push
 * @memberof CSMAPI
 * @function
 * @param {string} mac_addr
 * @param {string} password
 * @param {string} idf_name
 * @param {string} data
 * @param {callback} callback
 */
CSMAPI.prototype.push = function(mac_addr, password, idf_name, data, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (callback) {
        callback(false);
      }
    } else if (this.readyState === 4) {
      if (callback) {
        callback(new Error('Http status '+this.status.toString()));
      };
    }
  };
  xhttp.onerror = function(e) {
    if (callback) {
      callback(e);
    }
  }
  xhttp.open('PUT', this._ENDPOINT + '/' + mac_addr + '/' + idf_name, true);
  xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhttp.setRequestHeader("password-key", password);
  xhttp.send(JSON.stringify({
    'data': data
  }));
}

/**
 * DAN(Device Application to Network)
 * @class
 * @constructor
 * @param {object} profile
 * @param {string} endpoint
 */
function DAN(profile = {}, mac_addr = '', endpoint = '') {
  profile.odf_list.push('__Ctl_O__');
  profile.odf_list.push('__Ctl_I__');

  profile['df_list'] = [];
  profile['is_sim'] = false;

  for (let i = 0; i < profile.odf_list.length; i++) {
    let odf_name = profile.odf_list[i];
    profile['df_list'].push(odf_name);
  }
  for (let i = 0; i < profile.idf_list.length; i++) {
    let idf_name = profile.idf_list[i];
    profile['df_list'].push(idf_name);
  }
  /**
   * @member {string} _profile
   * @private
   */
  this._profile = profile;
  /**
   * @member {string} _mac_addr
   * @private
   */
  this._mac_addr = mac_addr;
  /**
   * @member {Object} _CSMAPI
   * @private
   */
  this._CSMAPI = new CSMAPI(endpoint);
  /**
   * @member {boolean} _registered
   * @private
   */
  this._registered = false;
  /**
   * @member {string} _password
   * @private
   */
  this._password = '';
  /**
   * @member {list} _idf_list
   * @private
   */
  this._idf_list = profile['idf_list'].slice();
  /**
   * @member {list} _odf_list
   * @private
   */
  this._odf_list = profile['odf_list'].slice();
  /**
   * @member {list} _df_list
   * @private
   */
  this._df_list = profile['df_list'].slice();
  /**
   * @member {Object} _df_selected
   * @private
   */
  this._df_selected = {};
  /**
   * @member {Object} _odf_timestamp
   * @private
   */
  this._odf_timestamp = {};
  /**
   * @member {boolean} _suspended
   * @private
   */
  this._suspended = true;
  /**
   * @member {string} _ctl_timestamp
   * @private
   */
  this._ctl_timestamp = '';
  /**
   * @member {function} _has_new_data
   * @private
   */
  this._has_new_data = (dataset, timestamp) => {
    if (dataset.length === 0 || timestamp === dataset[0][0]) {
      return false;
    }
    return true;
  };
  /**
   * @member {Object} _on_callbacks
   * @private
   */
  this._on_callbacks = {
    'pull': () => {},
    'push': () => {}
  };
  /**
   * @member {function} on
   * @param {string} event
   * @param {callback} callback
   */
  this.on = (event, callback) => {
    this._on_callbacks[event] = callback;
  };
}

/**
 * @name register
 * @memberof DAN
 * @function
 * @param {callback} callback
 */
DAN.prototype.register = function(callback) {
  this._CSMAPI.register(this._mac_addr, this._profile, (err, d_name, password) => {
    if (err) {
      callback(err);
    } else {
      if (!this._registered) {
        this._registered = true;
        this._password = password;
        this._profile.d_name = d_name;
        for (let i = 0; i < this._df_list.length; i++) {
          this._df_selected[this._df_list[i]] = false;
        }
        for (let i = 0; i < this._odf_list.length; i++) {
          this._odf_timestamp[this._odf_list[i]] = '';
        }
        this._ctl_timestamp = '';
        this._suspended = false;
        setTimeout(this.pull_ctl, 0);
      }
      callback(false);
    }
  });
};

/**
 * @name deregister
 * @memberof DAN
 * @function
 * @param {callback} callback
 */
DAN.prototype.deregister = function(callback) {
  this._CSMAPI.deregister(this._mac_addr, callback);
};

/**
 * @name handle_command_message
 * @memberof DAN
 * @function
 */
DAN.prototype.handle_command_message = function(data) {
  switch (data[0]) {
    case 'RESUME':
      this._suspended = false;
      break;
    case 'SUSPEND':
      this._suspended = true;
      break;
    case 'SET_DF_STATUS':
      let flags = data[1]['cmd_params'][0];
      console.log();
      if (flags.length != this._df_list.length) {
        console.log(flags, this._df_list);
        return false;
      }
      for (let i = 0; i < this._df_list.length; i++) {
        this._df_selected[this._df_list[i]] = (flags[i] === '1');
      }
      break;
    default:
      console.log('Unknown command:', data);
      return false;
  }
  return true;
}
/**
 * register -> pull_ctl -> pull_odf(looping)
 * @name pull_ctl
 * @memberof DAN
 * @function
 * @param {callback} callback
 */
DAN.prototype.pull_ctl = function(callback) {
  if (!this._registered) {
    if (callback) callback(true);
    return;
  }
  this._CSMAPI.pull(this._mac_addr, this._password, '__Ctl_O__', (err, dataset) => {
    if (callback) callback(false);

    if (this._has_new_data(dataset, this._ctl_timestamp)) {
      this._ctl_timestamp = dataset[0][0];

      if (this.handle_command_message(dataset[0][1])) {
        switch (dataset[0][1][0]) {
          case 'SET_DF_STATUS':
            this.push('__Ctl_I__', ['SET_DF_STATUS_RSP', dataset[0][1][1]], (res) => {});
            break;
          case 'RESUME':
            this.push('__Ctl_I__', ['RESUME_RSP', ['OK']], (res) => {});
            break;
          case 'SUSPEND':
            this.push('__Ctl_I__', ['SUSPEND_RSP', ['OK']], (res) => {});
            break;
        }
      } else {
        console.log('Problematic command message:', dataset[0][1]);
      }
    }
  });
};
/**
 * @name push
 * @memberof DAN
 * @function
 * @param {string} idf_name
 * @param {string} data
 * @param {callback} callback
 */
DAN.prototype.push = function(idf_name, data, callback) {
  if (!this._registered||!this._idf_list.includes(idf_name)) {
    if (callback) callback(true);
    return;
  }
  this._CSMAPI.push(this._mac_addr, this._password, idf_name, data, (err) => {
    if (callback) {
      callback(err);
    }
  });
};
/**
 * @name pull
 * @memberof DAN
 * @function
 * @param {string} odf_name
 * @param {callback} callback
 */
DAN.prototype.pull = function(odf_name, callback) {
  if (!this._registered||!this._odf_list.includes(odf_name)) {
    if (callback) callback(true);
    return;
  }
  this._CSMAPI.pull(this._mac_addr, this._password, odf_name, (err, dataset) => {
    if (callback) {
      if (this._has_new_data(dataset, this._odf_timestamp[odf_name])) {
        this._odf_timestamp[odf_name] = dataset[0][0];
        callback(err, dataset[0][1]);
      }
      else {
        callback(err);
      }
    }
  });
};
/**
 * @name getSelectedDfs
 * @memberof DAN
 * @function
 * @param {callback} callback
 */
DAN.prototype.getSelectedDfs = function(callback) {
  if (!this._registered) {
    if (callback) callback(true);
    return;
  }
  this.pull_ctl((err)=> {
    if(err) {
      callback(err);
    }
    else {
      callback(err, this._df_selected);
    }
  });
};

/**
 * DAI(Device Application to Iot device)
 * @class
 * @constructor
 * @param {object} profile
 * @param {string} endpoint
 */

function DAI(profile, endpoint) {
  let _polling_timeout = 2000;
  // Handle mac address
  let mac_addr = (function() {
    function s() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s() + s() + s();
  })();

  let dan = new DAN(profile, mac_addr, endpoint);

  /** update suspend status */
  let _ctl_polling = () => {
    // dan.pull_ctl((ctrl) => {
    //   this.suspended = dan._suspended;
    //   setTimeout(_ctl_polling, _polling_timeout);
    // });
  };

  this.suspended = true;

  this.register = (callback) => {
    dan.register((err) => {
      callback(err, dan._profile);
      if (err) {

      } else {
        _ctl_polling();
      }
    });
  };

  this.deregister = (callback) => {
    dan.deregister(callback);
  }

  window.onunload = this.deregister;
  window.onbeforeunload = this.deregister;
  window.onclose = this.deregister;
  window.onpagehide = this.deregister;

  this.getSelectedDfs = (callback)=> {dan.getSelectedDfs(callback)};
  this.push = (idf_name, dataset, callback)=> {dan.push(idf_name, dataset, callback);};
  this.pull = (odf_name, callback)=> {dan.pull(odf_name, callback);};

}

export default DAI;
