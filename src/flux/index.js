// /src/flux/index.js
// Description:
// "index.js"
// Copyright 2018-2020 NOOXY. All Rights Reserved.

import Constants from './constants.json';
import Dispatcher from './dispatcher';
import Service from './service';
import IoTAPI from './lib/iottalk';

const debug = Constants.DEBUG;

function Flux(setState) {
  let _noservice_client;
  this.Dispatcher = Dispatcher.generateDispatcher(setState);
  this.Service = new Service(IoTAPI, this.Dispatcher);
  this.Service.enqueueSnackbar = this.enqueueSnackbar;
  this.Actions = this.Service.Actions;

  this.start = (next)=> {
    this.Service.start(next);
  };
};

export default Flux;
