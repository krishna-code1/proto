// ========================
// CONTACT FORM VALIDATION
// ========================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error on input
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
                this.style.borderColor = '#e0e0e0';
            });
        });
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate all fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    if (!validateField(name)) isValid = false;
    if (!validateField(email)) isValid = false;
    if (phone.value && !validateField(phone)) isValid = false;
    if (!validateField(subject)) isValid = false;
    if (!validateField(message)) isValid = false;
    
    if (isValid) {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        setTimeout(() => {
            document.getElementById('contactForm').reset();
        }, 500);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let errorMessage = '';
    let isValid = true;
    
    switch(fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name can only contain letters and spaces';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            } else if (value && value.replace(/\D/g, '').length < 10) {
                errorMessage = 'Phone number must be at least 10 digits';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (!value) {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showError(field, errorElement, errorMessage);
    } else {
        clearError(field, errorElement);
    }
    
    return isValid;
}

function showError(field, errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#e53935';
}

function clearError(field, errorElement) {
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '#4caf50';
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
    
    const inputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#e0e0e0';
    });
}

function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Hide form
    form.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
        form.style.display = 'flex';
        form.reset();
    }, 5000);
}
