const validateAddQuestion = (body, userId, quiz) => {
    const { question, answer, points, latitude, longitude } = body;

    if (!question || typeof question !== 'string') {
        return { isValid: false, message: 'Question is required and must be a string.' };
    }

    if (!answer || typeof answer !== 'string') {
        return { isValid: false, message: 'Answer is required and must be a string.' };
    }

    if (typeof points !== 'number' || points < 1 || points > 10) {
        return { isValid: false, message: 'Points must be a number between 1 and 10.' };
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return { isValid: false, message: 'Latitude and longitude must be numbers.' };
    }

   return { isValid: true };
};

module.exports = {
    validateAddQuestion,
};
