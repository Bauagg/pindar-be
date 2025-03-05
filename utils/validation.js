export const validateUser = (fullName, email, phoneNumber) => {
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    return nameRegex.test(fullName) && emailRegex.test(email) && phoneRegex.test(phoneNumber);
};
