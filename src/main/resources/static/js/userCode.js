const url = "http://localhost:8080/user/api"
const tbody = document.getElementById('tbody')
const navEmail = document.getElementById('navEmail')
const navRoles = document.getElementById('navRoles')
let bodyElements = ''


// Отображение информации авторизированного Юзера
async function showElements() {
    const user = await fetch(url).then(r => r.json()).catch(e => console.log(e))
    bodyElements += `<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${getRoles(user)}</td>
                     </tr>`

    tbody.innerHTML = bodyElements
    navEmail.innerHTML = user.email
    navRoles.innerHTML = getRoles(user)
}

// Получение строки с доступными ролями для юзера
const getRoles = (user) => {
    let userRoles = ''
    user.roles.forEach(data => userRoles += data.shortName + ' ')
    return userRoles
}

// запуск асинхронного метода страницы
showElements()




