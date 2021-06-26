import User from './model/User.js';
const userModel = new User();

function verifyEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function md5(string) {
    return CryptoJS.MD5(string).toString();
}

function docToObject(doc) {
    return {
        id: doc.id,
        data: doc.data(),
    };
}

function docsToArray(docs) {
    const arr = [];
    docs.forEach(function (doc) {
        arr.push(docToObject(doc));
    });

    return arr;
}

function saveCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function renderUser(container_el, user) {
    container_el.insertAdjacentHTML(
        'beforeend',
        `<tr id=row-${user.id}><th scope="row" class="text-center">${user.id}</th><td class="text-center email">${user.email}</td><td class="text-center password">${user.password}</td><td class="text-center"><button data-id="${user.id}" class="btn btn-warning me-2 edit" data-email="${user.email}" data-password="${user.password}" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-edit"></i></button><button data-id="${user.id}" class="btn btn-danger remove"><i class="fas fa-user-minus"></i></button></td></tr>`
    );

    const tr = container_el.querySelector(`tr#row-${user.id}`);
    const btnDelete = tr.querySelector('.remove');

    btnDelete.onclick = () => {
        Swal.fire({
            title: 'Notice!',
            text: 'Do you want to delete user ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                userModel._deleteUser(user.id).then(() => {
                    tr.remove();
                    Swal.fire('Done!', '', 'success');
                });
            }
        });
    };
}

export { verifyEmail, md5, docToObject, docsToArray, saveCurrentUser, getCurrentUser, renderUser };
