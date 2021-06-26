class BaseComponent extends HTMLElement {
    props;
    state;
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this.props = {};
        this.state = {};
    }

    connectedCallback() {
        this.render();
        this.componentDidMount();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.props[name] = newValue;
        this.render();
        this.componentDidUpdate();
    }

    disconnectedCallback() {
        this.componentWillUnmount();
    }

    setState(newState) {
        this.state = newState;
        this.render();
        this.componentDidUpdate();
    }

    /**
     * In html ra ngoài màn hình
     * Gán sự kiện cho các thẻ bên trong component
     */
    render() {}

    /**
     * Được gọi sau khi component được sinh ra, sau khi render
     * Gọi 1 lần duy nhât
     */
    componentDidMount() {}

    /**
     * Được gọi sau khi props hoặc state thay đổi, sau khi render
     */
    componentDidUpdate() {}

    /**
     * Được gọi trước khi component biến mất khỏi DOM
     */
    componentWillUnmount() {}
}

export { BaseComponent };
