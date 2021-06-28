import { BaseComponent } from '../BaseComponent.js';
import { getCurrentUser } from '../ultils.js';

import FB from '../FB.js';

class ChatScreen extends BaseComponent {
    constructor() {
        super();

        this.state = {
            data: {
                msg: '',
            },
        };

        this.game;
    }

    render() {
        const style = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
            .chat-container{
                height: 100%;
                max-height: 600px;
                margin-bottom: 20px;
                overflow-y: scroll;
            }
        </style>
        `;

        this._shadowRoot.innerHTML = `
        ${style}
        <section class="index-screen">
            <h1 class="p-5 text-center">Chat room</h1>
           <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="chat-container border-primary border rounded p-4">
                    </div>
                    <div class="chat-form d-flex">
                        <input-wrapper type="text" class="input-chat w-100" placeholder="Say something..."></input-wrapper>
                        <button class="btn btn-success ms-2 sendchat">
                            <i class="fab fa-telegram-plane"></i>
                        </button>
                    </div>
                </div>
           </div>
           <div id="boss"></div>
         <a href="./#!project/" class="d-block text-center">Home</a>
        </section>
        `;

        const chatInput = this._shadowRoot.querySelector('.input-chat');
        const btnSend = this._shadowRoot.querySelector('.sendchat');
        const chatContainer = this._shadowRoot.querySelector('.chat-container');
        chatInput._shadowRoot.querySelector('label').style.display = 'none';
        chatInput._shadowRoot.querySelector('.invalid-feedback').classList.remove('invalid-feedback');
        chatInput._shadowRoot.querySelector('.mb-3').classList.remove('mb-3');

        FB.collection('chats')
            .orderBy('createdAt')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        // console.log('New city: ', change.doc.data());

                        const msgList = change.doc.data();
                        chatContainer.insertAdjacentHTML(
                            'beforeend',
                            `
                        <div class="mess-item mb-3 pb-3 border-bottom">
                            <div class="mess-label d-flex ${msgList.email === getCurrentUser().data.email ? 'justify-content-end' : ''}">
                                <strong class="badge ${msgList.email === getCurrentUser().data.email ? 'bg-success' : 'bg-secondary'}">${msgList.email}</strong>
                            </div>
                            <div class="mess-content ${msgList.email === getCurrentUser().data.email ? 'text-end' : ''}">
                            ${msgList.msg}
                            </div>
                        </div>
                    `
                        );
                    }
                });
            });

        btnSend.onclick = async () => {
            const email = getCurrentUser().data.email;
            let response = await FB.collection('chats').add({
                email: email,
                msg: chatInput.value,
                createdAt: String(Date.now()),
            });

            chatInput.value = '';
        };
    }
}

window.customElements.define('chat-screen', ChatScreen);
