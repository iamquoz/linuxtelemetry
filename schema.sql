CREATE TABLE public.activity (
    pcname character varying(255) NOT NULL,
    "time" bigint NOT NULL,
    app character varying(255) NOT NULL,
    innerid integer NOT NULL
);

ALTER TABLE public.activity ALTER COLUMN innerid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.activity_innerid_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999999
    CACHE 1
);

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (innerid);



--
-- pgadmin generated schema
--

