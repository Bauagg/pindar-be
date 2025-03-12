-- Announcement Table
CREATE TABLE announcement (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              status VARCHAR(50) NOT NULL,
                              created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
                              updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              is_deleted BOOLEAN DEFAULT FALSE
);
