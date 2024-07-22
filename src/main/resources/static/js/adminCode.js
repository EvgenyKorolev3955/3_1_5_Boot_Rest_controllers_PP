const url = "http://localhost:8080/admin/api"
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
const HttpHeaders = {'Content-Type' : 'application/json', 'X-XSRF-TOKEN' : csrfToken}
const userTbody = document.getElementById('userTbody')
const adminTbody = document.getElementById('adminTbody')
const navEmail = document.getElementById('navEmail')
const navRoles = document.getElementById('navRoles')
const newUserForm = document.getElementById('newUserForm')
const newUserUsername = document.getElementById('newUserUsername')
const newUserPassword = document.getElementById('newUserPassword')
const newUserEmail = document.getElementById('newUserEmail')
const newUserRolesSelect = document.getElementById('newUserRolesSelect')
const modalWindow = new bootstrap.Modal(document.getElementById('modalWindow'))
const modalForm = document.getElementById('modalForm')
const modalId = document.getElementById('modalId')
const modalUsername = document.getElementById('modalUsername')
const modalPassword = document.getElementById('modalPassword')
const modalEmail = document.getElementById('modalEmail')
const modalSelectRoles = document.getElementById('modalSelectRoles')
const modalButtonSubmit = document.getElementById('ModalButtonSubmit')
const TitleModalLabel = document.getElementById('TitleModalLabel')
const ROLE_USER = {"id":1,"name":"ROLE_USER"}
const ROLE_ADMIN = {"id":2,"name":"ROLE_ADMIN"}
let option = ''
let rolesList = []
let userTableBodyElements = ''
let adminTableBodyElements = ''


// Отображение информации авторизированного Юзера
async function showUserInfoElements() {
    const user = await fetch(url + '/user').then(r => r.json()).catch(e => console.log(e))
    userTableBodyElements += `<tr>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td>${getRoles(user)}</td>
                               </tr>`
    userTbody.innerHTML = userTableBodyElements
    navEmail.innerHTML = user.email
    navRoles.innerHTML = getRoles(user)
}


// Заполнение блоков <select> в форме модального окна и создания нового юзера
async function fillFields(){
    rolesList =  await fetch(url + '/roles').then(r => r.json()).catch(e => console.log(e))
    let options = ''
    for (let i = 0; i<rolesList.length; i++) {
        if (rolesList[i].id == ROLE_USER.id) {
            options += `<option value="${rolesList[i].id}" selected="true">${rolesList[i].shortName}</option>`
        } else {
            options += `<option value="${rolesList[i].id}">${rolesList[i].shortName}</option>`
        }
    }
    modalSelectRoles.innerHTML = options
    newUserRolesSelect.innerHTML = options
}


// Отображение всех пользователей в таблице Администратора
async function showAdminTableElemens() {
    const UsersList = await fetch(url).then(r => r.json()).catch(e => console.log(e))
    UsersList.forEach(user => {
        adminTableBodyElements += `<tr>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.email}</td>
                                    <td>${getRoles(user)}</td>
                                    <td><button type="button" class="btn btnEdit btn-info">Edit</button></td>
                                    <td><button type="button" class="btn btnDelete btn-danger">Delete</button></td>
                                   </tr>`
    })
    adminTbody.innerHTML = adminTableBodyElements
}

// Получение строки с доступными ролями для юзера
const getRoles = (user) => {
    let userRoles = ''
    user.roles.forEach(role => userRoles += (role.shortName + ' '))
    return userRoles
}


// Отправка на создание нового юзера в БД
async function sendNewUser(user) {
    await fetch(url , {
        method:"POST",
        headers: HttpHeaders,
        credentials: 'include',
        body: JSON.stringify(user)} )
        .then(response => location.reload())
        .catch(e => {console.log(e)})
}

// Отправка на изменение существующего юзера в БД
async function sendEditUser(user) {
    await fetch(url , {
        method:"PUT",
        headers: HttpHeaders,
        credentials: 'include',
        body: JSON.stringify(user)} )
        .then(response => location.reload())
        .catch(e => {console.log(e)})
}


// Отправка на удаление юзера по его ID
async function sendDeleteUser(id) {
    await fetch(url , {
        method:"DELETE",
        headers: HttpHeaders,
        credentials: 'include',
        body: JSON.stringify(id)} )
        .then(response => location.reload())
        .catch(e => {console.log(e)})
}

// Метод для упрощения инициализации эвентов кнопок
const action = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}


//  Открытие модального окна для редактирования пользователя
action(document, 'click', '.btnEdit', async e => {
    const tableRow = e.target.parentNode.parentNode
    const idForm = tableRow.children[0].innerHTML
    const user = await fetch(url + '/user/' + idForm).then(r => r.json()).catch(e => console.log(e))
    modalId.value = idForm
    modalUsername.value = user.username
    modalPassword.value = ''
    modalEmail.value = user.email
    option = 'edit'
    modalButtonSubmit.classList = 'btn btn-primary'
    modalButtonSubmit.innerHTML = 'Edit'
    TitleModalLabel.innerHTML = 'Edit User'
    modalWindow.show()
})


// Открытие модального окна для удаления пользователя
action(document, 'click', '.btnDelete', async e => {
    const tableRow = e.target.parentNode.parentNode
    const idForm = tableRow.children[0].innerHTML
    const user = await fetch(url + '/user/' + idForm).then(r => r.json()).catch(e => console.log(e))
    modalId.value = idForm
    modalUsername.value = user.username
    modalPassword.value = user.password
    modalEmail.value = user.email
    modalUsername.setAttribute("readonly", true)
    modalPassword.setAttribute("readonly", true)
    modalEmail.setAttribute("readonly", true)
    modalSelectRoles.setAttribute("readonly", true)
    option = 'delete'
    modalButtonSubmit.classList = 'btn btn-danger'
    modalButtonSubmit.innerHTML = 'Delete'
    TitleModalLabel.innerHTML = 'Delete User'
    modalWindow.show()
})


//  Действие при нажатии кнопки Submit в форме для создания нового юзера
newUserForm.addEventListener('submit', e => {
    e.preventDefault()
    let roles = []
    for (let op of newUserRolesSelect.selectedOptions) {
        if (op.value == ROLE_USER.id) {
            roles.push(ROLE_USER)
        } else if (op.value == ROLE_ADMIN.id)
            roles.push(ROLE_ADMIN)
    }
    let user = {
        id: 0,
        username: newUserUsername.value,
        password: newUserPassword.value,
        email: newUserEmail.value,
        roles: roles
    }
    sendNewUser(user)
})


//  Действие при нажатии кнопки Submit в модальном окне
modalForm.addEventListener('submit', e => {
    e.preventDefault()
    if(option == 'edit') {
        let roles = []
        for (let op of modalSelectRoles.selectedOptions) {
            if (op.value == ROLE_USER.id) {
                roles.push(ROLE_USER)
            } else if (op.value == ROLE_ADMIN.id)
                roles.push(ROLE_ADMIN)
        }
        let user = {
            id: modalId.value,
            username: modalUsername.value,
            password: modalPassword.value,
            email: modalEmail.value,
            roles: roles
        }
        if (user.password == '') {
            alert( "Пароль должен содержать от 2 до 100 символов!" )
        } else {
            sendEditUser(user)
            modalWindow.hide()
        }
    }
    if(option == 'delete') {
        sendDeleteUser(modalId.value)
        modalWindow.hide()
    }

})


// запуск асинхронных методов страницы
fillFields()
showUserInfoElements();
showAdminTableElemens();