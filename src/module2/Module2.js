import sharePNG from 'Images/share.png';

export default class Module2 {

    constructor() {}
    
    render() {
        return `
            <div class="module2">
                Module2
                <img src="${ sharePNG }" />
            </div>
        `;
    }
}