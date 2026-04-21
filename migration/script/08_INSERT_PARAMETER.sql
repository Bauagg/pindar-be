INSERT INTO parameters (param_key, param_value, description)
VALUES
    ('ACCESS_TOKEN_EXPIRY_MINUTES', '60', 'Access token expiration time in minutes'),
    ('REFRESH_TOKEN_EXPIRY_MINUTES', '21600', 'Refresh token expiration time in minutes (15 days)');
INSERT INTO parameters (param_key, param_value, description)
VALUES
    ('OTP_EMAIL_TEMPLATE', 'Your OTP code is: {{OTP}}', 'Template for OTP emails'),
    ('OTP_EMAIL_SUBJECT', 'Your One-Time Password (OTP)', 'Subject for OTP emails');