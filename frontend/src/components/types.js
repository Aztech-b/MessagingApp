/**
 * @typedef {Object} Message
 * @property {string} content
 * @property {{ user: { username: string } }} author
 */

/**
 * @typedef {Object} Chat
 * @property {string} title
 * @property {number} id
 * @property {number} unreadCount
 * @property {Message[]} messages
 */
/**
 * @typedef {{id: number, content: string, chatId: number, sent: string, author: {username: string}}} newMessageData
 */
export {};
