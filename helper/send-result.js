const sendResult = (response, result, status = 200) => {
    response.status(status).json(result);
};

module.exports = sendResult;