import fatPNG from './images/fat.png';

export default function() {
    var b = 1;
    return `
        <div class="component2">
            <img src="${ fatPNG }" />
            <p>Component2</p>
        </div>
    `;
}