// /src/flux/dispatcher.js
// Description:
// "dispatcher.js"
// Copyright 2018-2020 NOOXY. All Rights Reserved.

import Dispatcher from './lib/dispatcher';

function generateDispatcher(setState) {
  let _dispatcher = new Dispatcher();
  let id1 = _dispatcher.register((payload)=> {
    if(payload.type === 'updateLang') {
      setState( { lang: payload.data } );
    }

    else if(payload.type === 'updateLocalizes') {
      setState( { localizes: payload.data } );
    }

    else if(payload.type === 'updateIoTtalkProfile') {
      setState( { iottalk_profile: payload.data } );
    }
    else if(payload.type === 'updateEndpoint') {
      setState( { endpoint: payload.data } );
    }
    else if(payload.type === 'updateControls') {
      setState( { controls: payload.data } );
    }

    else if(payload.type === 'updateUserMeta') {
      setState( { UserMeta: payload.data } );
    }
    else if(payload.type === 'updateDarktheme') {
      setState( { DarkTheme: payload.data } );
    }
  });

  return _dispatcher;
}

export default {generateDispatcher: generateDispatcher};
