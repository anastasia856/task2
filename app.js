"use strict";

    const form = document.forms["form"];
    const button = form.elements["buttonSubmit"];
    const buttonReset = form.elements["buttonReset"];
    const inputArr = Array.from(form); // массив всех элементов формы
    const validInputArr = []; // массив валидных инпутов
    const LS = localStorage;
    let formData = {}; // объект для хранения данных пользователя

    // добавление атрибута и заполнение массива
    inputArr.forEach((element) => {
        if (element.hasAttribute("data-reg")) {  
        element.setAttribute("is-valid", "0");
        validInputArr.push(element);
        }
    });

    form.addEventListener("input", inputHandler);
    button.addEventListener("click", buttonHandler);
    buttonReset.addEventListener("click", resetForm);

    function inputHandler({target}) {
        // если input имеет маску (т.е. атрибут с регулярным выражением), то запускаем проверку
        if (target.hasAttribute("data-reg")) {
            inputCheck(target);
        };

        // записываем данные в объект formData и localStorage (LS)
        formData[target.name] = target.value;
        LS.setItem('formData', JSON.stringify(formData));
    }

    // выводим данные в форму из LS
    if (LS.getItem('formData')) {
        formData = JSON.parse(LS.getItem('formData'));
        for (let key in formData) {
            form.elements[key].value = formData[key];
        }
    }

    // проверка рег. выражений
    function inputCheck(element) {
        const inputValue = element.value;
        const inputReg = element.getAttribute("data-reg");
        const reg = new RegExp(inputReg);
        
        if (reg.test(inputValue)) {
            removeError(element);
        } else {
            addError(element);
        }
    }

    // валидация пройдена успешно
    function removeError(element) {
        element.classList.remove('no-valid');
        element.classList.add('valid');
        element.setAttribute("is-valid", "1");
    }

    // валидация не пройдена
    function addError(element) {
        element.classList.remove('valid');
        element.classList.add('no-valid');
        element.setAttribute("is-valid", "0");
    }

    // валидация всей формы
    function buttonHandler(event) {
        const isAllValid = []; 
        validInputArr.forEach((element) => {
            isAllValid.push(element.getAttribute("is-valid"));
        });
        const isValid = isAllValid.reduce((acc, current) => {
            return (Number(acc) + Number(current));
        });

        if (isValid < validInputArr.length) {
            event.preventDefault();
        }
    }

    // очищение стилей при сбросе
    function resetForm() {
        validInputArr.forEach((el) => {
            el.classList.remove('valid');
            el.classList.remove('no-valid');
        });
    }