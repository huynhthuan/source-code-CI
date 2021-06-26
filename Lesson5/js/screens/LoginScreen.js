import { BaseComponent } from '../BaseComponent.js';

import { verifyEmail, md5, saveCurrentUser, docsToArray } from '../ultils.js';

import FB from '../FB.js';

class LoginScreens extends BaseComponent {
    constructor() {
        super();

        this.state = {
            errors: {
                email: '',
                password: '',
            },

            data: {
                email: '',
                password: '',
            },
        };
    }

    render() {
        const style = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">`;
        this._shadowRoot.innerHTML = `
        ${style}
        <section class="login-screen">
            <div class="row">
                <div class="col-12 pt-5">
                    <h1 class="text-center">Đăng nhập</h1>
                </div>
                <div class="col-md-6 mx-auto">
                    <form id="loginForm" class="border p-4 mt-5 rounded">
                        <input-wrapper type="email" class="email" label="Email:" label-for="email" input-id="email"
                            placeholder="Điền email đăng nhập" name="email" value="${this.state.data.email}" error="${this.state.errors.email}">
                        </input-wrapper>
                        <input-wrapper type="password" class="password" label="Mật khẩu:" label-for="password" input-id="password"
                            placeholder="Nhập mật khẩu" name="password" value="${this.state.data.password}" error="${this.state.errors.password}">
                        </input-wrapper>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success w-100">Đăng nhập</button>
                        </div>
                        <a href="./#!project/register" class="d-block text-center">Đăng ký</a>
                    </form>
                </div>
            </div>
        </section>
        `;

        this.$loginForm = this._shadowRoot.querySelector('#loginForm');

        this.$loginForm.onsubmit = async (event) => {
            event.preventDefault();

            //Get data form input
            let email = this.$loginForm.querySelector('.email').value;
            let password = this.$loginForm.querySelector('.password').value;

            //Validate data
            let isPassed = true;

            if (email === '' || !verifyEmail(email)) {
                isPassed = false;
                this.state.errors.email = 'Invalid email. Try again!';
            } else {
                this.state.errors.email = '';
                this.state.data.email = email;
            }

            if (password === '') {
                isPassed = false;
                this.state.errors.password = 'Password is required. Try again!';
            } else {
                this.state.errors.password = '';
                this.state.data.password = password;
            }

            //Get data user by form input from FIREBASE
            if (isPassed) {
                let response = await FB.collection('users').where('email', '==', email).where('password', '==', md5(password)).get();

                if (response.empty) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Username or email is not correct.',
                        icon: 'error',
                        confirmButtonText: 'Try again!',
                    });
                } else {
                    const userAffected = docsToArray(response.docs)[0];
                    saveCurrentUser(userAffected);
                    router.navigate('/');
                    Swal.fire({
                        title: 'Success',
                        text: 'Welcome back!',
                        icon: 'success',
                        confirmButtonText: 'Oke',
                    });
                }
            }

            //Set state
            this.setState(this.state);
        };
    }
}

window.customElements.define('login-screen', LoginScreens);
