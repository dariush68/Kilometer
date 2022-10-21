const pickrContainer = document.querySelector('.pickr-container');
const themeContainer = document.querySelector('.theme-container');
const themes = [
    [
        'classic',
        {
            swatches: [
                'rgb(255,0,0)',
                'rgb(0, 0, 255)',
                'rgb(0, 128, 0)',
                'rgba(255,255,0)',
                'rgb(255,105,180)',
                'rgb(128,0,128)',
                'rgb(0, 255, 255)',
                'rgb(255, 255, 255)',
                'rgb(0, 0, 0)',
                'rgba(112, 112, 112)',
                'rgb(165, 42, 42)',
                'rgb(210, 105, 30)',
                'rgb(74, 129, 127)',
                'rgb(255, 165, 0)'
            ],

            components: {
                preview: true,
                opacity: true,
                hue: true,

                interaction: {
                    hex: true,
                    rgba: true,
                    hsva: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        }
    ],
];

const buttons = [];
let pickr = null;

for (const [theme, config] of themes) {
    const button = document.createElement('button');
    button.innerHTML = theme;
    buttons.push(button);

    button.addEventListener('click', () => {
        const el = document.createElement('p');
        pickrContainer.appendChild(el);

        // Delete previous instance
        if (pickr) {
            pickr.destroyAndRemove();
        }

        // Apply active class
        for (const btn of buttons) {
            btn.classList[btn === button ? 'add' : 'remove']('active');
        }

        // Create fresh instance
        pickr = new Pickr(Object.assign({
            el, theme,
            default: '#42445a'
        }, config));
    });

    themeContainer.appendChild(button);
}

buttons[0].click();
