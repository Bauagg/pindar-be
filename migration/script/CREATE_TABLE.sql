CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name,
    full_name VARCHAR(255) ,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    status VARCHAR(50),
    password VARCHAR(300),
    last_login TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE TABLE user_role (
    user_id VARCHAR(100),
    role_id VARCHAR(100)
)

CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL
)

CREATE TABLE otp_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_email VARCHAR(255) NOT NULL,
      otp_code VARCHAR(150) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL
);

CREATE TABLE refresh_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        revoked BOOLEAN DEFAULT FALSE
);

CREATE TABLE parameters (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        param_key VARCHAR(255) UNIQUE NOT NULL,
        param_value TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO parameters (param_key, param_value, description)
VALUES
    ('ACCESS_TOKEN_EXPIRY_MINUTES', '60', 'Access token expiration time in minutes'),
    ('REFRESH_TOKEN_EXPIRY_MINUTES', '21600', 'Refresh token expiration time in minutes (15 days)');