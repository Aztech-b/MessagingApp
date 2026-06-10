/**
 * @typedef {Object} Message
 * @property {string} content
 * @property {Author} author
 */

/**
 * @typedef {Object} Author
 * @property {{username: string}} user
 */

/**
 * @typedef {Object} Chat
 * @property {string} title
 * @property {number} id
 * @property {number} unreadCount
 * @property {number} lastReadMessageId
 * @property {Message[]} messages
 */

/**
 * @typedef {Object} ChatData
 * @property {(Message & {id: number})[]} messages
 * @property {number} allReadMessageId
 * @property {{members: {color: string, user: {username: string}}[]}} members
 * @property {{lastReadMessageId: number, color: string}} chatMember
 */

/**
 * @typedef {Object} newMessageData
 * @property {number} id
 * @property {string} content
 * @property {number} chatId
 * @property {string} sent
 * @property {Author} author
 */

export {};
