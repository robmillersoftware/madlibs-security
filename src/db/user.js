/**
 * Class representing a user document in a mongo DB
 */
export default class UserSchema {
    constructor(user) {
        return {
            id: user.uuid,              //Unique identifier for this user. Will eventually be JWT
            history: user.history       //The user's chat history. Eventually, each session will have its own history
        }
    }
}