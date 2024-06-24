document.addEventListener('DOMContentLoaded', function() {
    // Authentication
    document.getElementById('login-btn').addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    });

    document.getElementById('register-btn').addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        updateUI();
    });

    function register() {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const phone = document.getElementById('register-phone').value.trim();
        const password = document.getElementById('register-password').value.trim();
        
        if (username && email && password) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username || user.email === email)) {
                alert('El usuario o el correo ya existen.');
                return;
            }
            users.push({ username, email, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registrado con éxito.');
            document.getElementById('register-username').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-phone').value = '';
            document.getElementById('register-password').value = '';
        }
    }

    function login() {
        const usernameOrEmail = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (usernameOrEmail && password) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password)) {
                localStorage.setItem('loggedInUser', usernameOrEmail);
                updateUI();
                alert('Inicio de sesión exitoso.');
                document.getElementById('login-username').value = '';
                document.getElementById('login-password').value = '';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        }
    }

    function updateUI() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('chat-section').style.display = 'block';
            document.getElementById('photo-section').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'block';
            displayMessages();
            displayPhotos();
        } else {
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('chat-section').style.display = 'none';
            document.getElementById('photo-section').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'none';
        }
    }

    // Chat functionality
    document.getElementById('chat-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (message && loggedInUser) {
            let messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push({ user: loggedInUser, text: message });
            localStorage.setItem('messages', JSON.stringify(messages));
            chatInput.value = '';
            displayMessages();
        }
    });

    // Photo upload functionality
    document.getElementById('upload-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const photoInput = document.getElementById('photo-input');
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgData = e.target.result;
                let photos = JSON.parse(localStorage.getItem('photos')) || [];
                photos.push(imgData);
                localStorage.setItem('photos', JSON.stringify(photos));
                displayPhotos();
            };
            reader.readAsDataURL(file);
        }
    });

    // Display chat messages
    function displayMessages() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.forEach(message => {
            const messageElem = document.createElement('div');
            messageElem.className = 'message';
            messageElem.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
            chatBox.appendChild(messageElem);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Display photos
    function displayPhotos() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
        let photos = JSON.parse(localStorage.getItem('photos')) || [];
        photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo;
            gallery.appendChild(img);
        });
    }

    updateUI();
});

