const post_form = $("[name = 'postForm']");
const firstName = $("[name = 'first']");
const secondName = $("[name = 'second']");
const address = $("[name = 'email']");
const date = $("[name = 'date']");
const gender = $("[name = 'gender']");
const teh = $("[name = 'teh']");
const submitbtn = $("[name = 'submit_btn']");
const rem_check = $("[name = 'remember']");
const passName = $("[name = 'password']");

var validationSummary = "";

function validate(form) {
    let result = true;
    validationSummary = "";
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!firstName.val()) {
        result = false;
        validationSummary += "Имя пустое!\n";
    }
    if (!secondName.val()) {
        result = false;
        validationSummary += "Фамилия пуста!\n";
    }
    if (!address.val()) {
        result = false;
        validationSummary += "Логин пуст!\n";
    }
    else if (reg.test(address.val()) == false) {
        result = false;
        validationSummary += "Введите корректный e-mail!\n";
    }

    return result;
}

function dateAge(form) {
    let result = true;

    if (!date.val()) {
        result = false;
        validationSummary += "Дата пустая!\n";
    }
    else {
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Текущя дата без времени
        let dob = new Date(date.val());
        let dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate()); //ДР в текущем году
        let age = today.getFullYear() - dob.getFullYear();

        if (today < dobnow) {
            age = age - 1;
        }

        if (age < 18) {
            result = false;
            validationSummary += "Ваш возраст меньше 18!\n";
        }
    }
    return result;
}

function checkTeh(form) {
    let count = 0;
    let result = true;
    for (let check of teh) {
        if (check.checked) count++;
    }
    if (count < 3) {
        result = false;
        validationSummary += "Должно быть выбрано 3 и более значений!\n";
    }

    return result;
}

function checkPass(form) {
    let result = true;
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/;

    if (!passName[0].value) {
        result = false;
        validationSummary += "Пароль пуст!\n";
    }
    else if (passName[0].value !== passName[1].value) {
        result = false;
        validationSummary += "Пароли должны совпадать\n";
    }
    else if (reg.test(passName[0].value) == false) {
        result = false;
        validationSummary += "Введите корректный пароль!\n";
    }
    return result;
}
var ls = window.localStorage;

function checkRemember(form) {
    if (rem_check[0].checked) {
        const myLog = JSON.stringify(address.val());
        const myPass = JSON.stringify(passName[0].value);
        if (window.localStorage != undefined) {
            ls.setItem("login", myLog);
            ls.setItem("password", myPass);
        }
        else {
            document.cookie = "login=" + myLog + "; password=" + myPass + "; ";
        }
    }
    else {
        ls.clear();
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).ready(() => {
    if (ls.length > 0) {
        address.val(JSON.parse(ls.getItem("login")));
        passName[0].value = JSON.parse(ls.getItem("password"));
    }
    else if (document.cookie.length > 0) {
        address.val(getCookie("login"));
        passName[0].val(getCookie("password"));
    }
})

submitbtn.click((e) => {
    e.preventDefault();
    if (validate(this) && dateAge(this) && checkTeh(this) && checkPass(this)) {
        checkRemember(this);
        post_form.submit();
        alert("Отправлено!");
    }
    else {
        alert(validationSummary);
    }
})

