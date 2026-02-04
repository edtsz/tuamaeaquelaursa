
export const clear = ({ commit, state }) => {
  console.info( 'action: clear' );

  commit('clear');
}



export const connect_to_box = ({ commit, state }) => {
  console.info( 'action: connect_to_box' );

  if ( state._user_box === null )
    commit('connect_to_box');
}



export const hydrate_messages = ({ commit, state }, params) => {
  console.info( 'action: hydrate_messages' );

  if ( state._user_box === null )
    throw 'user_box undefined.';

  if ( state.messages.length !== 0 ) {
    console.error('hydrate_messages: messages.length !== 0');
    return;
  }

  if ( state._unsubscribe ) {
    state._unsubscribe();
    state._unsubscribe = null;
  }

  state._unsubscribe = state._user_box
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        var res = change.doc.data();
        res.key = change.doc.id;

        commit(`${change.type}_messages`, res);
      });

      commit('sort_messages');
    });
}
