CREATE OR REPLACE FUNCTION update_search_index_credit_card()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NOT NEW.is_deleted THEN
            INSERT INTO public.search_index (ref_id, type, title, image_id, direct_link)
            VALUES (NEW.id, 'credit_card', NEW.title, NEW.image_id, NEW.direct_link);
END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.is_deleted THEN
DELETE FROM public.search_index
WHERE ref_id = NEW.id AND type = 'credit_card';
ELSE
            INSERT INTO public.search_index (ref_id, type, title, image_id, direct_link)
            VALUES (NEW.id, 'credit_card', NEW.title, NEW.image_id, NEW.direct_link)
            ON CONFLICT (ref_id, type) DO UPDATE
                                              SET title = EXCLUDED.title,
                                              image_id = EXCLUDED.image_id,
                                              direct_link = EXCLUDED.direct_link;
END IF;

    ELSIF TG_OP = 'DELETE' THEN
DELETE FROM public.search_index
WHERE ref_id = OLD.id AND type = 'credit_card';
END IF;

RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_search_index_lender()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NOT NEW.is_deleted THEN
            INSERT INTO public.search_index (ref_id, type, title, image_id, direct_link)
            VALUES (NEW.id, 'lender', NEW.lender_name, NEW.image_id, NEW.direct_link);
END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.is_deleted THEN
DELETE FROM public.search_index
WHERE ref_id = NEW.id AND type = 'lender';
ELSE
            INSERT INTO public.search_index (ref_id, type, title, image_id, direct_link)
            VALUES (NEW.id, 'lender', NEW.lender_name, NEW.image_id, NEW.direct_link)
            ON CONFLICT (ref_id, type) DO UPDATE
                                              SET title = EXCLUDED.title,
                                              image_id = EXCLUDED.image_id,
                                              direct_link = EXCLUDED.direct_link;
END IF;

    ELSIF TG_OP = 'DELETE' THEN
DELETE FROM public.search_index
WHERE ref_id = OLD.id AND type = 'lender';
END IF;

RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE public.search_index (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                     ref_id UUID NOT NULL,
                                     type TEXT NOT NULL CHECK (type IN ('credit_card', 'lender')),
                                     title TEXT NOT NULL,
                                     image_id UUID,
                                     direct_link TEXT,
                                     created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Optional index for faster search
CREATE INDEX idx_search_index_title ON public.search_index USING gin (to_tsvector('simple', title));

-- For credit_card
CREATE TRIGGER trg_credit_card_search_index
    AFTER INSERT OR UPDATE OR DELETE ON public.credit_card
    FOR EACH ROW EXECUTE FUNCTION update_search_index_credit_card();

-- For lender
CREATE TRIGGER trg_lender_search_index
    AFTER INSERT OR UPDATE OR DELETE ON public.lender
    FOR EACH ROW EXECUTE FUNCTION update_search_index_lender();

ALTER TABLE public.search_index
    ADD CONSTRAINT unique_ref_type UNIQUE (ref_id, type);