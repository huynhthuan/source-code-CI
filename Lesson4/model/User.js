import db from '../database/db.js';

class User {
    constructor() {}

    async _getAll() {
        const results = await db.collection('users').get();
        return results.docs;
    }

    async _addUser(user) {
        return await db.collection('users').add({
            email: user.email,
            password: user.password,
        });
    }

    async _deleteUser(id) {
        return await db.collection('users').doc(id).delete();
    }

    async _updateUser(user) {
        return await db.collection('users').doc(user.id).update({
            email: user.email,
            password: user.password,
        });
    }
}

export default User;
