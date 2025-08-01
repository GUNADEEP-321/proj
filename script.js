// Form Handling
const form = document.getElementById('contactForm');
const inputs = form.querySelectorAll('input, textarea');
const submitBtn = form.querySelector('.submit-btn');

// Add loading state to button
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = `
            <i class="fas fa-paper-plane mr-2"></i>
            Send Message
        `;
        submitBtn.disabled = false;
    }
}

// Check if all form fields are valid
function checkFormValidity() {
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value || input.classList.contains('invalid')) {
            isValid = false;
        }
    });
    submitBtn.disabled = !isValid;
}

// Validate individual fields
function validateField(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    let isValid = true;
    
    switch(field.id) {
        case 'name':
            if (field.value.length < 2) {
                errorDiv.textContent = 'Name should be at least 2 characters long';
                isValid = false;
            }
            break;
        case 'mobile':
            if (!/^[0-9]{10}$/.test(field.value)) {
                errorDiv.textContent = 'Please enter a valid 10-digit mobile number';
                isValid = false;
            }
            break;
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                errorDiv.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            break;
        case 'message':
            if (field.value.length < 10) {
                errorDiv.textContent = 'Message should be at least 10 characters long';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        field.classList.add('invalid');
    } else {
        field.classList.remove('invalid');
        errorDiv.textContent = '';
    }
    return isValid;
}

// Add validation on blur and input
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
        checkFormValidity();
    });

    input.addEventListener('input', function() {
        // Remove error states while typing
        this.classList.remove('invalid');
        this.parentNode.querySelector('.error-message').textContent = '';
        checkFormValidity();
    });
});

// Handle form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields first
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    // If form is not valid, don't submit
    if (!isFormValid) {
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const message = document.getElementById('message').value;

        // Send email using EmailJS
        await emailjs.send(
            "service_vqcdm7v", // EmailJS service ID
            "template_h7ssk46", // EmailJS template ID
            {
                name: name,
                email: email,
                mobile: mobile,
                message: message,
                to_name: "Gunadeep",
                reply_to: email,
            }
        );

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Thank you for your message!</h3>
                <p>Hi ${name}, I'll get back to you soon at ${email}</p>
            </div>
        `;
        
        document.body.appendChild(successMessage);
        
        // Clear the form
        this.reset();
        
        // Reset loading state
        setLoadingState(false);
        checkFormValidity();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(successMessage)) {
                    document.body.removeChild(successMessage);
                }
            }, 300);
        }, 5000);

    } catch (error) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'success-message error';
        errorMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Oops!</h3>
                <p>Something went wrong. Please try again later.</p>
            </div>
        `;
        document.body.appendChild(errorMessage);
        
        // Reset loading state
        setLoadingState(false);
        checkFormValidity();
        
        setTimeout(() => {
            errorMessage.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(errorMessage)) {
                    document.body.removeChild(errorMessage);
                }
            }, 300);
        }, 5000);
    }
});
