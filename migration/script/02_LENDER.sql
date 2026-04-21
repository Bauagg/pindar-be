-- Lender Table
CREATE TABLE lender (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        lender_name TEXT NOT NULL,
                        direct_link TEXT NOT NULL,
                        max_loan NUMERIC NOT NULL,
                        max_tenor INT NOT NULL,
                        total_loan NUMERIC NOT NULL,
                        loan_type TEXT NOT NULL,
                        image_id TEXT NOT NULL,
                        is_deleted BOOLEAN DEFAULT FALSE,
                        created_by TEXT NOT NULL,
                        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_by TEXT,
                        updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lender Detail Table (One-to-One with Lender)
CREATE TABLE lender_detail (
                               lender_id UUID PRIMARY KEY REFERENCES lender(id) ON DELETE CASCADE,
                               additional_information TEXT NOT NULL,
                               terms_document TEXT NOT NULL
);

-- Other Lender Table (Many-to-Many Self-Relation)
CREATE TABLE other_lender (
                              id UUID NOT null DEFAULT uuid_generate_v4(),
                              lender_id UUID NOT NULL,
                              related_lender_id UUID NOT NULL,
                              relation_type TEXT NOT NULL,
                              PRIMARY KEY (id),
                              FOREIGN KEY (lender_id) REFERENCES lender(id) ON DELETE CASCADE,
                              FOREIGN KEY (related_lender_id) REFERENCES lender(id) ON DELETE CASCADE
);

-- Lender FAQ Table (One-to-Many)
CREATE TABLE product_faq (
                             id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             product_type TEXT NOT NULL,
                             information_title TEXT NOT NULL,
                             detail_information TEXT NOT NULL,
                             order_number INT NOT NULL DEFAULT 1
);
