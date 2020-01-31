import alienPNG from './images/alien.png';

export default function() {
    return `
        <div class="component1">
            Component1
            <img src="${ alienPNG }" />
            <p>Hello World</p>
        </div>
    `;
}