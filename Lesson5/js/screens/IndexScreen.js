import { BaseComponent } from '../BaseComponent.js';
import { renderUser } from '../ultils.js';

import User from '../model/User.js';

class IndexScreen extends BaseComponent {
    constructor() {
        super();
    }

    render() {
        const style = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
        `;
        let script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js';

        this._shadowRoot.innerHTML = `
        
        ${style}
        <section class="index-screen">
            <h1 class="p-5 text-center">Users</h1>

            <div class="table-action mb-2 d-flex justify-content-between">
                <a href="./#!project/chat" class="btn btn-primary">Chat</a>
                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="add-btn">Add user</button>
            </div>

            <table class="table table-bordered" id="user-table">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">#</th>
                        <th scope="col" class="text-center">Email</th>
                        <th scope="col" class="text-center">Password</th>
                        <th scope="col" class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Edit user</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="text" class="form-control" id="password">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" id="save-edit" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel2">Add user</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email-add">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="text" class="form-control" id="password-add">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" id="save-add" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;

        this._shadowRoot.appendChild(script);

        const userTableBody = this._shadowRoot.querySelector('#user-table tbody');
        const addBtnEl = this._shadowRoot.querySelector('#add-btn');
        const editModal = this._shadowRoot.querySelector('#exampleModal');
        const modalEmail = editModal.querySelector('#email');
        const modalPassword = editModal.querySelector('#password');

        const addModal = this._shadowRoot.querySelector('#exampleModal2');
        const modalAddEmail = addModal.querySelector('#email-add');
        const modalAddPassword = addModal.querySelector('#password-add');

        const btnEdit = editModal.querySelector('#save-edit');
        const btnAdd = this._shadowRoot.querySelector('#save-add');

        const userModel = new User();

        userModel._getAll().then((users) => {
            const editModalEl = new bootstrap.Modal(editModal);
            const addModalEl = new bootstrap.Modal(addModal);

            users.forEach((user) => {
                const userData = {
                    id: user.id,
                    email: user.data().email,
                    password: user.data().password,
                };
                renderUser(userTableBody, userData);
            });

            addBtnEl.onclick = () => {
                addModalEl.show();
            };

            const editBtnEl = this._shadowRoot.querySelectorAll('.edit');

            editBtnEl.forEach((btn) => {
                btn.onclick = () => {
                    const email = btn.getAttribute('data-email');
                    const password = btn.getAttribute('data-password');
                    const idDoc = btn.getAttribute('data-id');

                    modalEmail.value = email;
                    modalPassword.value = password;
                    btnEdit.setAttribute('doc-id', idDoc);

                    editModalEl.show();
                };
            });
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
    }
}

window.customElements.define('index-screen', IndexScreen);
