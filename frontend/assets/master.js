window.data = null;

function getData(callback = () => {}) {
    if (window.data) return window.data;

    fetch(`${window.location.origin}:8080`, {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.json())
    .then(res => {
        window.data = res;
        callback(res);
    });
}

const getReactContent = (pattern, processors, target) => getData((data => {
    const databinds = {
        "data:domaci": data.tymy[0].jmeno,
        "data:hosti": data.tymy[1].jmeno
    }

    let message = pattern;
    const reactData = pattern.match(/(data:)\w+/gim) ?? [];
    const reactPole = pattern.match(/(pole:)\w+/gim) ?? [];

    for (const pole of reactPole) {
        const id = pole.replace("pole:", "");
        const input = document.getElementById(id);

        if (!input) {
            console.warn(`Input pole ${id} nebylo nalezeno. Přeskakuje se.`);
            continue;
        }
        
        input.addEventListener("input", (event) => {
            const fields = document.getElementsByClassName(id);
            for (const field of fields) {
                field.innerHTML = processors?.[pole]?.(event.target.value) ?? event.target.value;
            }
        });
        
        message = message.replaceAll(pole, `<span class="${id}">${processors?.[pole]?.(null) ?? "..."}</span>`);
        input.dispatchEvent(new Event("input"));
    }

    for (const info of reactData) {
        message = message.replaceAll(info, `<span>${databinds[info]}</span>`);
    }

    target.innerHTML = message;
}));