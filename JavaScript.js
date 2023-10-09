const currentTime = document.querySelector('.time');
let alarmTime;
let ringtone = new Audio("./alarm/Experience.mp3");
let isAlarmSet = false;
setInterval(() => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let amPm = "AM";

    if (h >= 12) {
        h = h - 12;
        amPm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.innerHTML = `${h}:${m}:${s} ${amPm}`;

    if (alarmTime == `${h}:${m} ${amPm}`) {
        ringtone.play();
        ringtone.loop = true;
    }
}, 1000);

window.addEventListener('load' , () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;



    nameInput.addEventListener('change' , e => {
        localStorage.setItem('username' , e.target.value);
    })

    newTodoForm.addEventListener('submit' , e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
        }

        todos.push(todo);

        localStorage.setItem('todos' , JSON.stringify(todos));
        
        e.target.reset()

        displayTodos();
    })
    displayTodos();
})

function displayTodos() {
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item')

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const selectHour = document.createElement('select');
        const selectMinute = document.createElement('select');
        const selectAm = document.createElement('select');
        const actions = document.createElement('div');
        const setAlarm = document.createElement('button');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');


        if (todo.category == 'personal') {
            span.classList.add('personal')
        } else if(todo.category == 'business') {
            span.classList.add('business')
        } else {
            span.classList.add('family')
        }

        content.classList.add('todo-content');
        selectHour.classList.add('set-time');
        selectMinute.classList.add('set-time');
        selectAm.classList.add('set-time');
        setAlarm.classList.add('set-alarm');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        setAlarm.innerHTML = 'SetAlarm';
        content.innerHTML = `<input type="text" class="input-show-todo" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edite';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(selectHour);
        todoItem.appendChild(selectMinute);
        todoItem.appendChild(selectAm);
        todoItem.appendChild(setAlarm);
        todoItem.appendChild(actions);
        todoList.appendChild(todoItem);

        const time = document.querySelectorAll('select');

        for(let i= 12; i > 0; i--){
            i = i < 10 ? "0" + i : i;
            const optionHour = document.createElement('option');
            optionHour.innerHTML = i;
            selectHour.appendChild(optionHour);

        }
        for(let i= 60; i >= 0; i--){
            i = i < 10 ? "0" + i : i;
            const optionMinute = document.createElement('option');
            optionMinute.innerHTML = i;
            selectMinute.appendChild(optionMinute);

        }
        for(let i= 2; i > 0; i--){
            const optionAm = document.createElement('option');
            optionAm.innerHTML = i < 2 ? "AM" : "PM";;
            selectAm.appendChild(optionAm);

        }
    
        
        setAlarm.addEventListener('click' , () => {
            const setAlarmBut = todoItem.querySelector('.set-alarm');
            if (isAlarmSet) {
                alarmTime = "";
                ringtone.pause();
                setAlarmBut.innerHTML = "Set Alarm";
                return isAlarmSet = false;
            }

            let time = `${selectHour.value}:${selectMinute.value} ${selectAm.value}`;
            isAlarmSet = true;
            alarmTime = time;
            setAlarmBut.innerHTML = "Clear";

        });
    
        if(todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener("click" , e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos' , JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            displayTodos();
        })

        edit.addEventListener('click' , e =>{
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur' , e =>{
                input.setAttribute('readonly' , true);
                todo.content = e.target.value;
                localStorage.setItem('todos' , JSON.stringify(todos));
                displayTodos();
            })
        })
        deleteButton.addEventListener('click' , e =>{
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos' , JSON.stringify(todos));
            displayTodos();
        })

    })

}
