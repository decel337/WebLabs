document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        const data = {
            name: document.querySelector('._nm').value,
            mail: document.querySelector('._mail').value,
            message: document.querySelector('._mes').value,
        };

        if (error === 0) {
            form.classList.add('_sending');
            const response = await fetch('http://localhost:3001/sendMes', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                let text = await response.text();
                alert(text.slice(0, 80));
                form.reset();
            } else {
                if (response.status === 429) {
                    alert('Too many requests. Please, wait');
                } else {
                    alert('Error');
                }
            }
            form.classList.remove('_sending');
        }
    }

    function formValidate() {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);

            if (input.classList.contains('_mail')) {
                if (!mailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (
                input.getAttribute('type') === 'checkbox' &&
                input.checked === false
            ) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
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
        let reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        return reg.test(input.value);
    }
});
