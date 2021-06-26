import FB from '../FB.js';

class User {
    constructor() {}

    async _getAll() {
        const results = await FB.collection('users').get();
        return results.docs;
    }

    async _addUser(user) {
        return await FB.collection('users').add({
            email: user.email,
            password: user.password,
        });
    }

    async _deleteUser(id) {
        return await FB.collection('users').doc(id).delete();
    }

    async _updateUser(user) {
        return await FB.collection('users').doc(user.id).update({
            email: user.email,
            password: user.password,
        });
    }
}

export default User;
