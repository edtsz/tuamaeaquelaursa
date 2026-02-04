
export const current_page = (state, to) => {
  state.current_page = to.name;
  state.current_params = to.params;

  console.info('mutation: current_page = ' + to.name);
}


export const toggle_loader = (state) => {
  state.loader = !state.loader;

  console.info('mutation: toggle_loader = ' + state.loader);
}


export const clear = (state) => {
  state._unsubscribe && state._unsubscribe();
  state.messages = [];
  state.message = state.loading;
  state._user_box = null;

  console.info('mutation: cleared');
}


export const connect_to_box = (state) => {
  var recipient = (state.current_params.email + state._hosting.suffix).toLowerCase();

  state._user_box = state._db.collection('MAILBOXES').doc(recipient).collection('INBOX').limit(3);

  console.info('mutation: connect_to_box');
}


export const added_messages = (state, msg) => {
  state.messages.unshift(msg);

  console.info('mutation: added_messages');
}


export const modified_messages = (state, msg) => {
  state.messages.forEach((currentValue, index, arr) => {
    if (currentValue.key === msg.key) {
      Object.keys(currentValue).forEach(prop => {
        if (msg[prop]) {
          currentValue[prop] = msg[prop];
        }
      })
    }
  });

  console.info('mutation: modified_messages');
}


export const removed_messages = (state, msg) => {
  state.messages.forEach((currentValue, index, arr) => { currentValue.key === msg.key && arr.splice(index, 1) });

  console.info('mutation: removed_messages ' + msg.key);
}


export const sort_messages = (state) => {
  console.log('sort');

  state.messages.sort((a, b) => {
    console.log('sorting');
    return a.created_at < b.created_at;
  });

  console.info('mutation: sort_messages ');
}
