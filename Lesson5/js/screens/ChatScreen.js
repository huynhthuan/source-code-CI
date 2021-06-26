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

        var config = {
            type: Phaser.AUTO,
            width: 600,
            height: 947,
            parent: this._shadowRoot.querySelector('#boss'),
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };

        this.game = new Phaser.Game(config);

        let action = 'idle';
        let myHp = 100;
        let bossPlayer, bossPlayer2;

        function preload() {
            this.load.atlas('boss', '/assets/boss1.png', '/assets/boss1.json');
        }

        function create() {
            this.anims.create({
                key: 'idle',
                frameRate: 2,
                frames: this.anims.generateFrameNames('boss', {
                    prefix: 'boss1-',
                    suffix: '.png',
                    start: 1,
                    end: 2,
                }),
                repeat: -1,
            });

            this.anims.create({
                key: 'atk',
                frameRate: 6,
                frames: this.anims.generateFrameNames('boss', {
                    prefix: 'boss1-',
                    suffix: '.png',
                    start: 3,
                    end: 7,
                }),
            });

            this.anims.create({
                key: 'die',
                frameRate: 1,
                frames: this.anims.generateFrameNames('boss', {
                    prefix: 'boss1-',
                    suffix: '.png',
                    start: 8,
                    end: 8,
                }),
            });

            bossPlayer = this.add.sprite(100, 500, 'boss', 'boss1-1.png').setOrigin(0.5, 0);
            bossPlayer2 = this.add.sprite(500, 500, 'boss', 'boss1-1.png').setOrigin(0.5, 0);

            bossPlayer2.scaleX = -1;

            bossPlayer.hp = 100;
            bossPlayer2.hp = 100;

            // bossPlayer.startAtk = function (target) {
            //     if (bossPlayer.hp <= 0) {
            //         bossPlayer.playAfterRepeat('die');
            //     }
            //     let min = 3,
            //         max = 6;
            //     let rand = Math.floor(Math.random() * (max - min + 1) + min);

            //     console.log('Boss 1 Wait for ' + rand + ' seconds');

            //     let i = rand;
            //     let timeWaitAtk = setInterval(() => {
            //         i--;
            //         if (i === 0) {
            //             bossPlayer.play('atk');
            //             target.hp -= rand * 8;
            //             console.log('Boss 1 danh [' + rand * 8 + '] - HP Boss 2: ' + target.hp);
            //             bossPlayer.chain(['idle']);

            //             clearInterval(timeWaitAtk);

            //             if (target.hp <= 0) {
            //                 clearTimeout(timeLoopAtk);
            //                 clearInterval(timeWaitAtk);
            //                 console.log('Boss 2 die');
            //             }
            //         }
            //     }, 1000);

            //     let timeLoopAtk = setTimeout(bossPlayer.startAtk, rand * 1000, target);
            // };

            // bossPlayer2.startAtk = function (target) {
            //     console.log(bossPlayer2.hp);
            //     if (bossPlayer2.hp <= 0) {
            //         bossPlayer2.playAfterRepeat('die');
            //     }

            //     let min = 3,
            //         max = 6;
            //     let rand = Math.floor(Math.random() * (max - min + 1) + min);

            //     console.log('Boss 2 Wait for ' + rand + ' seconds');

            //     let i = rand;
            //     let timeWaitAtk = setInterval(() => {
            //         i--;
            //         if (i === 0) {
            //             bossPlayer2.play('atk');
            //             target.hp -= rand * 8;
            //             console.log('Boss 2 danh  [' + rand * 8 + '] - HP Boss 1: ' + target.hp);
            //             bossPlayer2.chain(['idle']);

            //             clearInterval(timeWaitAtk);
            //             if (target.hp <= 0) {
            //                 clearTimeout(timeLoopAtk);
            //                 clearInterval(timeWaitAtk);
            //                 console.log('Boss 1 die');
            //             }
            //         }
            //     }, 1000);

            //     let timeLoopAtk = setTimeout(bossPlayer2.startAtk, rand * 1000, target);
            // };

            bossPlayer.play(action);
            bossPlayer2.play(action);

            // bossPlayer.startAtk(bossPlayer2);
            // bossPlayer2.startAtk(bossPlayer);
        }

        function update() {}
    }

    componentWillUnmount() {
        this.game.destroy();
        console.log();
    }
}

window.customElements.define('chat-screen', ChatScreen);
