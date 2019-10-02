import './module1.css';
import windowPNG from './images/eye.png';

export default class Module1 {

    constructor() {

    }

    render() {
        return `
            <div class="module1">
                Module1
                <img src="${ windowPNG }" />
                <p>Hello World</p>
            </div>
        `;
    }
}