const form = document.getElementById('form');
const alert = document.getElementById('alert');
const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        const error = formValidate();

        const data = form.elements.map(el => {
            data[el.name] = el.value;
        });

        if (!error) {
            clearAlert();
            let text;
            form.parentElement.classList.add('_sending');
            fetch('/sendMes', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                form.parentElement.classList.remove('_sending');
                if (response.status === 200) {
                    text = 'Message Sent';
                    alertText(text);
                    alert.classList.add('_okey');
                    form.reset();
                    return;
                }
                if (response.status === 429) {
                    text = 'Too may request. Please. wait';
                } else {
                    text = 'Unknown error. Message not send.';
                }
                alertText(text);
                alert.classList.add('_error');
            });
        }
    }

    function formValidate() {
        let error = 0;
        const formReq = document.querySelectorAll('._req');

        for (const input of formReq) {
            formRemoveError(input);
            if (
                (input.classList.contains('_mail') && !mailTest(input)) ||
                (input.getAttribute('type') === 'checkbox' &&
                    input.checked === false) ||
                input.value === ''
            ) {
                formAddError(input);
                error++;
            }
        }
        return error;
    }
    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    function mailTest(input) {
        return reg.test(input.value);
    }
    function alertText(str) {
        const labelText = document.getElementById('alert')?.children[1];
        labelText.textContent = str;
    }
    function clearAlert() {
        alert.className = 'alert';
    }
});
