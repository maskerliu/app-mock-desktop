let ErrorCode = {
    EMPTY_COOKIE: 1001
};

let CmdCode = {
    REQUEST: 5001,
    REQUEST_START: 5002,
    REQUEST_END: 5004,
    REGISTER_SUCCESS: 5005,
    STATISTICS: 5008
};

try {
    exports.ErrorCode = ErrorCode;
    exports.CmdCode = CmdCode;
} catch (ignore) {

}
