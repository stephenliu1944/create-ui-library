import windowPNG from './images/eye.png';

export default class Component1 {

    constructor() {

    }

    render() {
        return `
            <div class="component1">
                Component1
                <img src="${ windowPNG }" />
                <p>Hello World</p>
            </div>
        `;
    }
}