-- Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Card Publisher Table
CREATE TABLE card_publisher (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                number INT NOT NULL,
                                publisher_name TEXT NOT NULL,
                                is_deleted BOOLEAN DEFAULT FALSE
);

-- Card Feature Table
CREATE TABLE card_feature (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              feature_name TEXT NOT NULL,
                              is_deleted BOOLEAN DEFAULT FALSE
);

-- Credit Card Table
CREATE TABLE credit_card (
                             id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             image_id TEXT NOT NULL,
                             publisher_id UUID NOT NULL REFERENCES card_publisher(id) ON DELETE CASCADE,
                             feature_type_id UUID NOT NULL REFERENCES card_feature(id) ON DELETE CASCADE,
                             reward_or_fee TEXT NOT NULL,
                             detail_reward_or_fee TEXT,
                             title TEXT NOT NULL,
                             additional_card_annual_fee NUMERIC,
                             purchase_rate NUMERIC NOT NULL,
                             cashback_rate NUMERIC NOT NULL,
                             detail_cashback_rate TEXT,
                             minimum_withdraw NUMERIC NOT NULL,
                             monthly_income_minimum NUMERIC NOT NULL,
                             who_can_register TEXT NOT NULL,
                             must_have_credit_card BOOLEAN DEFAULT FALSE,
                             card_image_id TEXT NOT NULL,
                             is_deleted BOOLEAN DEFAULT FALSE,
                             created_by TEXT NOT NULL,
                             created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             updated_by TEXT,
                             updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Credit Card Detail Table (One-to-One with Credit Card)
CREATE TABLE credit_card_detail (
                                    card_id UUID PRIMARY KEY REFERENCES credit_card(id) ON DELETE CASCADE,
                                    additional_information TEXT NOT NULL,
                                    terms_document TEXT NOT NULL,
                                    product_description TEXT NOT NULL,
                                    bill_payment_tutorial TEXT NOT NULL
);

CREATE TABLE credit_card_features (
                                      credit_card_id UUID NOT NULL REFERENCES credit_card(id) ON DELETE CASCADE,
                                      feature TEXT NOT NULL
);

-- Create table for tracking product access
CREATE TABLE product_access (
                                id uuid PRIMARY KEY,
                                product_type VARCHAR(50) NOT NULL,  -- 'lender' or 'credit_card'
                                product_id INTEGER NOT NULL,
                                access_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                user_id UUID,
                                ip_address VARCHAR(45),
                                user_agent TEXT
);

-- Function to get date from timestamp (for constraint)
CREATE OR REPLACE FUNCTION get_date(timestamp) RETURNS date AS
'SELECT $1::date' LANGUAGE SQL IMMUTABLE;

-- Create unique constraint to prevent duplicate views per day from same user
CREATE UNIQUE INDEX unique_product_view_per_day ON product_access
    (product_type, product_id, user_id, get_date(access_date))
    WHERE user_id IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX idx_product_access_date ON product_access(access_date);
CREATE INDEX idx_product_access_product ON product_access(product_type, product_id);
CREATE INDEX idx_product_access_user ON product_access(user_id);