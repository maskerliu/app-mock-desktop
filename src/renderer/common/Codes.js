let ErrorCode = {
    EMPTY_COOKIE: 1001
};

let CmdCode = {
    SET_COOKIE: 5001,
    REQUEST_START: 5002,
    REQUEST_DATA_COMPLETE: 5003,
    REQUEST_END: 5004,
    REGISTER_SUCCESS: 5005,
    SET_MOCK_CONFIG: 5006,
    SET_WS_UID: 5007,
};

try {
    exports.ErrorCode = ErrorCode;
    exports.CmdCode = CmdCode;
} catch (ignore) {

}
