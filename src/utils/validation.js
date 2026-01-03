const validator = require('validator');
const validateSignUpRequest = (req) => {
    const { firstName, lastName, password, emailId} = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error('All fields are required');
    }
    if (!validator.isEmail(emailId)) {
        throw new Error('Invalid email address');
    }
    if (!validator.isStrongPassword(password) || password.length < 8) {
        throw new Error('Password is not strong enough');
    }
};

validateProfileEditRequest = (req) => {

    const allowedEditFields = ['age', 'gender', 'bio', 'skills', 'profilePicture', 'phoneNumber'];
    const editFields = Object.keys(req.body);
    const invalidFields = editFields.filter(field => !allowedEditFields.includes(field));
    if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
    }
    return true;
};

module.exports = validateSignUpRequest;