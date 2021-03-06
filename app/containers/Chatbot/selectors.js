import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the chatbot state domain
 */
const selectChatbotDomain = state => state.get('chatbot', initialState);

/**
 * Other specific selectors
 */

const selectInput = () =>
  createSelector(selectChatbotDomain, state => ({
    input: state.get('input'),
    uuid: state.get('uuid'),
    _id: state.get('talkWrapper')._id,
  }));

/**
 * Default selector used by Chatbot
 */

const makeSelectChatbot = () =>
  createSelector(selectChatbotDomain, substate => {
    const toJS = substate.toJS();
    return toJS;
  });

export default makeSelectChatbot;
export { selectChatbotDomain, selectInput };
