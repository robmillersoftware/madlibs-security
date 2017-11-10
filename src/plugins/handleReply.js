/**
 * This method handles all input coming through superscript
 * @param {chat-user.js} cb- This is the callback function that actually sends the reply to the user
 */
exports.handleReply = function handleReply(cb) {
    cb(null, this.handleInput(this.user.id, this.message));
}