import './module1.scss';
import Component1 from './components/Component1.js';
import windowPNG from './images/eye.png';

export default class Module1 {

    constructor() {

    }

    render() {
        return `
            <div class="module1">
                Module1
                <img src="${ windowPNG }" />
            </div>
        `;
    }
}