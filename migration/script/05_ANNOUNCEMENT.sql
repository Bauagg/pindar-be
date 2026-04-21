-- Announcement Table
CREATE TABLE announcement (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              status VARCHAR(50) NOT NULL,
    url TEXT,
                              is_deleted BOOLEAN DEFAULT FALSE
);
