import player from './test.js';

class CustomInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open',
        });
        this._value = '';
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                console.log(newValue);
                if (newValue === 'modal') {
                    prompt('What your name ?');
                }
                break;
        }
    }

    connectedCallback() {
        var template = `<input type="text" class="custom-input" value="${this._value}">`;
        this.shadow.innerHTML = template;
        console.log(player);

        this.shadow.querySelector('input').onkeyup = (event) => {
            this.value = event.target.value;
        };

        this.onclick = () => {
            console.log(player);
        };
    }

    get value() {
        return this.shadow._value;
    }

    set value(val) {
        this.setAttribute('value', val);
    }
}
// export module
window.customElements.define('custom-input', CustomInput);
