import alienPNG from './images/alien.png';

export default function() {
    return `
        <h1 class="component1">
            Component1
            <img src="${ alienPNG }" />
            <p>Hello World</p>
        </h1>
    `;
}