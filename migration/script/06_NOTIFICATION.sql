CREATE TABLE notification (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for global notifications
                              title TEXT NOT NULL,
                              detail TEXT NOT NULL,
                              link TEXT,
                              created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              is_deleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE user_notification (
                                   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                   notification_id UUID NOT NULL REFERENCES notification(id) ON DELETE CASCADE,
                                   is_read BOOLEAN DEFAULT FALSE,
                                   is_deleted BOOLEAN DEFAULT FALSE, -- New column to mark user-specific deletion
                                   PRIMARY KEY (user_id, notification_id)
);
