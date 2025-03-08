-- Content Category Table
CREATE TABLE content_category (
                                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                  name TEXT NOT NULL,
                                  is_deleted BOOLEAN DEFAULT FALSE
);

-- Content Table
CREATE TABLE content (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         title TEXT NOT NULL,
                         category_id UUID NOT NULL REFERENCES content_category(id) ON DELETE CASCADE,
                         content_detail TEXT NOT NULL,
                         link_path TEXT NOT NULL,
                         is_deleted BOOLEAN DEFAULT FALSE,
                         created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment Table
CREATE TABLE comment (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
                         parent_comment_id UUID REFERENCES comment(id) ON DELETE CASCADE,
                         user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                         created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment Like Table
CREATE TABLE comment_like (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              comment_id UUID NOT NULL REFERENCES comment(id) ON DELETE CASCADE,
                              user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE (comment_id, user_id)
);
