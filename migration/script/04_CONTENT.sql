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
                        image_id TEXT,
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

CREATE TABLE content_views (
                               id uuid PRIMARY KEY,
                               content_id uuid NOT NULL REFERENCES content(id),
                               access_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               user_id INTEGER,
                               ip_address VARCHAR(45),
                               user_agent TEXT
);

-- Instead of using ::date in the constraint, create a function and use that
CREATE OR REPLACE FUNCTION get_date(timestamp) RETURNS date AS
'SELECT $1::date' LANGUAGE SQL IMMUTABLE;

-- Create a constraint using the function
CREATE UNIQUE INDEX unique_view_per_day ON content_views (content_id, user_id, get_date(access_date));

-- Index for faster trending queries
CREATE INDEX idx_content_views_date ON content_views(access_date);
CREATE INDEX idx_content_views_content ON content_views(content_id);