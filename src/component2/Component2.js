import fatPNG from './images/fat.png';

export default function() {
    var a = 1;
    var b = 2;
    
    return `
        <div class="component2">
            <img src="${ fatPNG }" />
            <p>Component2</p>
        </div>
    `;
}