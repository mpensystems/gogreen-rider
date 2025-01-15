/*
 *Copyright 2025 MP ENSYSTEMS ADVISORY PRIVATE LIMITED.
 *
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing, software
 *distributed under the License is distributed on an "AS IS" BASIS,
 *WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *See the License for the specific language governing permissions and
 *limitations under the License.
 */


export const errorCodes = {
  // General Error Codes
  ER401: {message: 'Invalid or expired session token.', statusCode: 401},
  ER402: {message: 'Invalid login credentials.', statusCode: 401},
  ER403: {
    message: 'Session token is required to be specified.',
    statusCode: 401,
  },
  ER405: {
    message: 'Requested content is not accessible in current session.',
    statusCode: 401,
  },
  ER500: {
    message: 'Internal server error. Try again later or contact administrator.',
    statusCode: 500,
  },
  ER701: {
    message: 'Invalid country code specified in mobile number.',
    statusCode: 400,
  },
  ER702: {message: 'Mobile number does not look valid.', statusCode: 400},
  ER703: {message: 'Field cannot be blank.', statusCode: 400},
  ER704: {message: 'Value of {0} is invalid or unsupported.', statusCode: 400},
  ER705: {message: 'The uploaded file is too large.', statusCode: 400},
  ER706: {message: 'File type of {0} is not supported.', statusCode: 400},
  ER707: {message: 'Invalid fileid. No such file {0}.', statusCode: 400},

  // Rider REST API Specific Codes
  ER201: {
    message:
      'Invalid Trip ID or the specified Trip ID is not accessible to the user.',
    statusCode: 400,
  },
  ER203: {
    message:
      'Photo not supported. Enable the pickup_photo / drop_photo module.',
    statusCode: 400,
  },
  ER202: {message: 'Photo is required.', statusCode: 400},
  ER204: {message: 'OTP must be specified.', statusCode: 400},
  ER205: {
    message:
      'Request cannot be processed at the moment. Please refresh and try again later.',
    statusCode: 403,
  },
  ER211: {
    message:
      'Invalid Booking ID specified or the specific booking is not accessible to the user.',
    statusCode: 400,
  },
  ER212: {message: 'Booking is not active.', statusCode: 400},
  ER221: {
    message: 'Last known location is stale. Refresh location to continue.',
    statusCode: 403,
  },
  ER222: {
    message: 'Operation not permitted from current location.',
    statusCode: 403,
  },
  ER250: {
    message:
      'Invalid first message. Identify yourself with an auth command first.',
    statusCode: NaN,
  },
};
