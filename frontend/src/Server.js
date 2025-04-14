// server.js

const validatePassword = (password) => {
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordCriteria.test(password);
};

const login=async ( email,password,isSeller) => { 
    const response = await fetch(`http://localhost:8000/account/api/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            seller: isSeller,  // Include seller if needed
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return  (await response.json())
}

module.exports = { validatePassword,login}; // Export the function
