import { BaseComponent } from '../BaseComponent.js';

import { verifyEmail, md5 } from '../ultils.js';

import FB from '../FB.js';

class RegisterScreen extends BaseComponent {
    constructor() {
        super();

        this.state = {
            errors: {
                email: '',
                password: '',
                repassword: '',
            },

            data: {
                email: '',
                password: '',
                repassword: '',
            },
        };
    }

    render() {
        const style = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">`;
        this._shadowRoot.innerHTML = `
        ${style}
        <section class="register-screen">
            <div class="row">
                <div class="col-12 pt-5">
                    <h1 class="text-center">Đăng ký</h1>
                </div>
                <div class="col-md-6 mx-auto">
                    <form id="registerForm" class="border p-4 mt-5 rounded">
                        <input-wrapper class="email" type="email" label="Email:" label-for="email" input-id="email"
                            placeholder="Điền email" name="email" value="${this.state.data.email}" error="${this.state.errors.email}">
                        </input-wrapper>
                        <input-wrapper class="password" type="password" label="Mật khẩu:" label-for="password" input-id="password"
                            placeholder="Nhập mật khẩu" name="password" value="${this.state.data.password}" error="${this.state.errors.password}">
                        </input-wrapper>
                        <input-wrapper class="repassword" type="password" label="Nhập lại mật khẩu:" label-for="re-password"
                            input-id="re-password" placeholder="Nhập lại mật khẩu" name="re-password" value="${this.state.data.repassword}" error="${this.state.errors.repassword}">
                        </input-wrapper>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success w-100">Đăng ký</button>
                        </div>
                        <a href="./#!project/login" class="d-block text-center">Đăng nhập</a>
                    </form>
                </div>
            </div>
        </section>
        `;

        this.$registerForm = this._shadowRoot.querySelector('#registerForm');

        this.$registerForm.onsubmit = async (event) => {
            event.preventDefault();

            //Get data form input
            let email = this.$registerForm.querySelector('.email').value;
            let password = this.$registerForm.querySelector('.password').value;
            let repassword = this.$registerForm.querySelector('.repassword').value;

            //Validate data
            let isPassed = true;

            // Get user by email
            let response = await FB.collection('users').where('email', '==', email).get();

            if (email === '' || !verifyEmail(email)) {
                isPassed = false;
                this.state.errors.email = 'Invalid email. Try again!';
            } else if (!response.empty) {
                isPassed = false;
                this.state.errors.email = 'Email has exits. Try other email!';
            } else {
                this.state.errors.email = '';
                this.state.data.email = email;
            }

            if (password === '') {
                isPassed = false;
                this.state.errors.password = 'Password is required. Try again!';
            } else if (password.length < 4) {
                isPassed = false;
                this.state.errors.password = 'Password must be more than 4 characters!';
            } else {
                this.state.errors.password = '';
                this.state.data.password = password;
            }

            if (repassword === '') {
                isPassed = false;
                this.state.errors.repassword = 'Re password is required. Try again!';
            } else if (repassword !== password) {
                isPassed = false;
                this.state.errors.repassword = 'Re password not match. Try again!';
            } else {
                this.state.errors.repassword = '';
                this.state.data.repassword = repassword;
            }

            //Get data user by form input from FIREBASE
            if (isPassed) {
                let response = await FB.collection('users').add({
                    email: email,
                    password: md5(password),
                });

                if (response.empty) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonText: 'Try again!',
                    });
                } else {
                    router.navigate('/login');
                    Swal.fire({
                        title: 'Success',
                        text: 'Register successfully! Login to explore more',
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

window.customElements.define('register-screen', RegisterScreen);
