const NLWSetup = class NLWSetup {
    data = {};
    habits = [];
    days = new Set()

    constructor(form) {
        this.form = form;
        this.daysContainer = this.form.querySelector('.days');
        this.form.addEventListener('change', () => this.#update());
        this.createHabits();
        this.load();
    }

    load() {
        const hasData = Object.keys(this.data).length > 0
        if(!hasData) return;

        this.#registerDays();
        this.renderLayout();
    }

    #registerDays() {
        Object.keys(this.data).forEach((key) => {
            this.data[key].forEach((date) => {
                this.days.add(date);
            })
        })
    }

    renderLayout() {
        this.daysContainer.innerHTML = ""
        for (let date of this.#getSortedDays()) {
            const [month, day] = date.split('-');
            this.#createDayElement(day + '/' + month);
        }
    }

    createHabits() {
        this.form
            .querySelectorAll(".habit")
            .forEach((habit) => this.#addHabit(habit.dataset.name));
    }

    #addHabit(habit) {
        this.habits = [...this.habits, habit];
        return this
    }

    #getFormattedDate(date) {
        const [day, month] = date.split("/");
        return month + '-' + day;
    }

    #update() {
        const formData = new FormData(this.form);
        const prepareData = {}
        for (let habit of this.habits) {
            prepareData[habit] = formData.getAll(habit)
        }

        this.setData(prepareData)
    }

    setData(data) {
        if (!data) {
            throw "Object data is needed { habitName: [...days: string]}";
        }
        this.data = data;
    }

    #getSortedDays() {
        return [...this.days].sort();
    }

    daysExist(date) {
        const formattedDate = this.#getFormattedDate(date);
        return [...this.days].includes(formattedDate);
    }

    addDay(date) {
        if(!date || !date?.includes('/')) return
        if(this.daysExist(date)) return
        this.days.add(this.#getFormattedDate(date))
        this.renderLayout();
    }

    #createDayElement(date) {
        const divDay = document.createElement('div');
        divDay.setAttribute('class', 'day');
        divDay.innerHTML = `<div>${date}</div>` + this.createCheckBoxes(date);
        this.daysContainer.append(divDay);
    }

    createCheckBoxes(date) {
        const formattedDate = this.#getFormattedDate(date);
        let checkboxes = '';
        for (let habit of this.habits) {
            checkboxes += `<input type="checkbox" name="${habit}" value="${formattedDate}" 
            ${this.data[habit]?.includes(formattedDate) && "checked"}/>`
        }

        return checkboxes;
    }
}

/*
    Criação da Class NLWSetup como um molde para a criação dos habits
    Capturar o formulário do HTML em uma variável e utiliza-la no molde criado, guardando o return em uma outra variável
    Sistema de dados, onde irá guardar as datas realizadas dos habitos
    Evento ao clicar no button "Register my day" e criar a day com as checkbox
    Sistema de guardar os dados na memória, e construir o form novamente quando a p[agina for resetada
*/ 
const form = document.querySelector('#form-habits');
const nlwSetup = new NLWSetup(form);

// Evento ao clicar no button "Register my day" e criar a day com as checkbox
const button = document.querySelector('header button');
button.addEventListener('click', () => {
    const today = new Date().toLocaleDateString("pt-br").slice(0, -5);
    const dayExists = nlwSetup.daysExist(today);

    if(dayExists) {
        alert(`Dia ${today} já criada(o) ⚠`);
        return
    }
    alert(`Dia ${today} adicionado com sucesso ✅`)
    nlwSetup.addDay(today);
});

// Evento na mudança do form, para que seja salvo os dados
form.addEventListener('change', () => {
    // utilizando o localStorage do próprio navegador "window.localStorage" (Objeto que guarda em memória informações do navegador)
    // Vai ser guardado todas as informações da aplicação no "data" que vai em seguida ser redirecionado ao LocalStorage (nlwSetup.data) para ser fixado na memória
    // Necessário transformar o objeto "nlwSetup.data" em uma string para ser passada ao LocalStorage, com o auxílio do JSON.stringify()
    localStorage.setItem('CheckSetup@habits', JSON.stringify(nlwSetup.data)); 
})

/* Capturando os dados guardados no LocalStorage --> localStorage.getItem('CheckSetup@habits'), 
transformando esses dados de string para object, com o auxílio do JSON.parse(text) --> JSON.parse('localStorage.getItem('CheckSetup@habits'))
*/
const data = JSON.parse(localStorage.getItem('CheckSetup@habits')) || {} // caso o 'data' não existe, deixe-o como objeto vazio 
nlwSetup.setData(data)
nlwSetup.load()

