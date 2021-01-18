const result = (_data = null, _statusCode = -1, _message = '', _numberofRecordedData = 0) => {
    return new Promise((resolve) => {
        resolve({
            isSuccess: (_statusCode == 0 || _data != null),
            statusCode: _statusCode == -1 ? (_data !== null ? 'success' : 'failed') : (_message.message ? _message.message : _message),
            numberofRecordedData: _numberofRecordedData,
            message: _message,
            data: _data
        })
    })
}

module.exports = result;