

function initModalCloseButtons() {
    let buttons = document.getElementsByClassName("close-modal");
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.addEventListener("click", function () {
            this.parentElement.parentElement.parentElement.style.display = 'none';
        });
    }
}

function showElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

function openModal(elementId, modalId) {
    document.getElementById(elementId).addEventListener("click", function () {
        showElement(modalId);
    });
}

async function getEditDataById(request) {
    const response = await fetch(request, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true && response.status === 200) {
        const data = await response.json();
        if (data) {
            setDataValues(data);
        } else {
            console.log("No response");
        }
    }
}

function setDataValues(data) {
    Object.keys(data).forEach(function (key) {
        element = document.getElementById(key);
        if (element.type && element.type === 'checkbox') {
            element.checked = data[key];
        } else {
            element.value = data[key];
        }
        //console.log(key, data[key]);
    });
}

function openEditModal(buttonClass, modalId, request) {
    let buttons = document.getElementsByClassName(buttonClass);
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.addEventListener("click", function () {
            showElement(modalId);
            getEditDataById(`${request}&id=${this.dataset.id}`);
        });
    }
}