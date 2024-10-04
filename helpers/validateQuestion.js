const validateAddQuestion = (body, userId, quiz) => {
    const { question, answer, points, latitude, longitude } = body;

    if (!question || typeof question !== 'string' || question.length < 5) {
        return { isValid: false, message: 'Question is required, must be a string, and at least 5 characters long.' };
    }

    if (!answer || typeof answer !== 'string' || answer.length < 1) {
        return { isValid: false, message: 'Answer is required and cannot be empty.' };
    }

    if (typeof points !== 'number' || points < 1 || points > 10) {
        return { isValid: false, message: 'Points must be a number between 1 and 10.' };
    }

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return { isValid: false, message: 'Latitude must be a number between -90 and 90.' };
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return { isValid: false, message: 'Longitude must be a number between -180 and 180.' };
    }

    return { isValid: true };
};

module.exports = {
    validateAddQuestion,
};
