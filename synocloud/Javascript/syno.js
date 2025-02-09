const form = document.getElementById('form');
const EmailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");                                                 
const allInputs = [passwordInput, EmailInput, confirmPasswordInput];

function showErrorMessages(errors) {
    const popup = document.createElement('div');
    popup.id = 'errorPopup';
    popup.classList.add('popup');

    const messageList = document.createElement('ul');
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        messageList.appendChild(errorItem);
    });
    popup.appendChild(messageList);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

function clearInputErrors(input) {
    const parent = input.parentElement;
    parent.classList.remove('incorrect');
}

form.addEventListener('submit', (e) => {
    const errors = getSignupFormErrors(
        EmailInput.value,
        passwordInput.value,
        confirmPasswordInput.value
    );

    if (errors.length > 0) {
        e.preventDefault();
        showErrorMessages(errors);
    } else {
        e.preventDefault(); // Prevent default form submission for AJAX
        submitSignupForm(); // Submit form data via AJAX
    }
});

function getSignupFormErrors(email, password, repeatPassword) {
    let errors = [];

    // Check if Email is provided and if it contains "@gmail.com"
    if (!email) {
        errors.push('Email is required');
        EmailInput.parentElement.classList.add('incorrect');
    } else if (!email.includes('@gmail.com')) {
        errors.push('This email does not exist (must be a Gmail address)');
        EmailInput.parentElement.classList.add('incorrect');
    }

    // Check if Password is provided and meets length requirement
    if (!password) {
        errors.push('Password is required');
        passwordInput.parentElement.classList.add('incorrect');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
        passwordInput.parentElement.classList.add('incorrect');
    }

    // Check if Repeat Password is provided and matches the original password
    if (!repeatPassword) {
        errors.push('Repeat password is required');
        confirmPasswordInput.parentElement.classList.add('incorrect');
    } else if (password !== repeatPassword) {
        errors.push('Passwords do not match');
        passwordInput.parentElement.classList.add('incorrect');
        confirmPasswordInput.parentElement.classList.add('incorrect');
    }

    return errors;
}

function submitSignupForm() {
    const userData = {
        email: EmailInput.value,
        password: passwordInput.value
    };

    // Send data to the backend via AJAX
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Sign up successful!');
            window.location.href = '/login';  // Redirect to login page
        } else {
            showErrorMessages([data.error]);
        }
    })
    .catch(error => {
        showErrorMessages(['An error occurred. Please try again later.']);
        console.error('Error:', error);
    });
}

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        clearInputErrors(input);
    });
});
