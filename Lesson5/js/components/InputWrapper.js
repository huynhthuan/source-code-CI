import { BaseComponent } from '../BaseComponent.js';

class InputWrapper extends BaseComponent {
    constructor() {
        super();

        this.props = {
            label_for: '',
            label: '',
            type: 'text',
            input_id: '',
            name: '',
            error: '',
            value: '',
            placeholder: '',
        };
    }

    static get observedAttributes() {
        return ['label_for', 'label', 'type', 'input_id', 'name', 'value', 'placeholder', 'error'];
    }

    render() {
        const style = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">`;

        this._shadowRoot.innerHTML = `
        ${style}
        <div class="mb-3">
            <label for="${this.props.label_for}" class="form-label">${this.props.label}</label>
            <input type="${this.props.type}" id="${this.props.input_id}" name="${this.props.name}" class="form-control has-validation input-main" value="${this.props.value}" placeholder="${this.props.placeholder}">
            <div class="invalid-feedback d-block">
                ${this.props.error}
            </div>
        </div>`;
    }

    get value() {
        return this.shadowRoot.querySelector('.input-main').value;
    }

    set value(val) {
        this.shadowRoot.querySelector('.input-main').value = val;
    }
}

window.customElements.define('input-wrapper', InputWrapper);
