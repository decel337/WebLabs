document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        const error = formValidate();

        const data = {
            name: document.querySelector('._nm').value,
            mail: document.querySelector('._mail').value,
            message: document.querySelector('._mes').value,
        };

        if (error === 0) {
            form.classList.add('_sending');
            const response = await fetch('/sendMes', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            form.classList.remove('_sending');
            clearAlert();
            const alert = document.getElementById('alert');
            const text = await response.text();
            if (response.ok) {
                alertText(text);
                alert.classList.add('_okey');
                form.reset();
            } else {
                alertText(text);
                alert.classList.add('_error');
            }
        }
    }

    function formValidate() {
        let error = 0;
        const formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);

            if (input.classList.contains('_mail')) {
                if (!mailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (
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
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        return reg.test(input.value);
    }
    function alertText(str) {
        const labelText = document.getElementById('text');
        labelText.innerHTML = str;
    }
    function clearAlert() {
        const alert = document.getElementById('alert');
        alert.style.display = 'block';
        alert.classList.remove('_okey');
        alert.classList.remove('_error');
    }
});
