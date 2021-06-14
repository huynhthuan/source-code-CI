import User from './model/User.js';

const userTableBody = document.querySelector('#user-table tbody');

const editModal = document.querySelector('#exampleModal');
const modalEmail = editModal.querySelector('#email');
const modalPassword = editModal.querySelector('#password');

const addModal = document.querySelector('#exampleModal2');
const modalAddEmail = addModal.querySelector('#email-add');
const modalAddPassword = addModal.querySelector('#password-add');

const btnEdit = editModal.querySelector('#save-edit');
const btnAdd = document.querySelector('#save-add');

const userModel = new User();

const renderUser = (container_el, user) => {
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
};

userModel._getAll().then((users) => {
    users.forEach((user) => {
        const userData = {
            id: user.id,
            email: user.data().email,
            password: user.data().password,
        };
        renderUser(userTableBody, userData);
    });
});

editModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const email = button.getAttribute('data-email');
    const password = button.getAttribute('data-password');
    const idDoc = button.getAttribute('data-id');

    modalEmail.value = email;
    modalPassword.value = password;
    btnEdit.setAttribute('doc-id', idDoc);
});

btnEdit.onclick = (event) => {
    const docId = event.target.getAttribute('doc-id');
    userModel
        ._updateUser({
            id: docId,
            email: modalEmail.value,
            password: modalPassword.value,
        })
        .then(() => {
            const trAffected = userTableBody.querySelector(`tr#row-${docId}`);
            const email = trAffected.querySelector('.email');
            const password = trAffected.querySelector('.password');
            email.innerText = modalEmail.value;
            password.innerText = modalPassword.value;
            Swal.fire('Update success!', '', 'success');
        });
};

btnAdd.onclick = () => {
    let newUser = {
        email: modalAddEmail.value,
        password: modalAddPassword.value,
    };

    userModel._addUser(newUser).then((response) => {
        modalAddEmail.value = '';
        modalAddPassword.value = '';
        newUser.id = response.id;
        renderUser(userTableBody, newUser);
        Swal.fire('Update success!', '', 'success');
    });
};
