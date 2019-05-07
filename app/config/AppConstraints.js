module.exports={
STATUSCODE:{
    BAD_REQUEST:400,
    INTERNAL_SERVER_ERROR:500,
    SUCCESS:200,
    UNAUTHORIZE:401,
    CREATED:201,
    APP_ERROR: 402,
    ROLE_CHANGE: 403
},
SUCCESS_MESSAGE: {
    DEFAULT: {
        customMessage: {
            'en': 'Successfully'
        }
    },
    SESSION_AVAILABLE:{
        customMessage: {
            'en': 'Session Avialable for this access token'
        }
    },
},
ERROR_MESSAGE: {
    EMAIL_ALREADY_EXIST: {
        customMessage: {
            'en': 'This email has been already exist'
        }
    },
    NO_ACCESS_TOKEN:{
        customMessage: {
            'en': 'No Access token or role provided'
        }
    },
    INVALID_PHONE_NUMBER_PROVIDED: {
        customMessage: {
            'en': 'The phone number you have entered is not registered with us'
        }
    },

    INVALID_EMAIL_PROVIDED:{
        customMessage: {
            'en': 'Invalid email provided'
        }
    },

    MARK_RESOLVE_PREMISSION: {
        customMessage: {
            'en': 'You have not permission to accept the request'
        }
    },
    PHONE_NUMBER_ALREADY:{
        customMessage: {
            'en': 'Phone number you have entered is already exists'
        }
    },
    TOKEN_EXPIRED: {
        customMessage: {
            'en': 'This otp has been expired'
        }
    },

    INVALID_PHONE_NUMBER_PASSWORD: {
        customMessage: {
            'en': 'Invalid phone number or password provided'
        }
    },
    INVALID_ACCESSTOKEN:{
        customMessage: {
            'en': 'Invalid phone number or password provided'
        }
    }

},
SERVER: {
    'SALT': 10
},
FILE_TYPE: [ 'img', 'pdf' ],
ROLE: {
    "USER": "user"
}
}