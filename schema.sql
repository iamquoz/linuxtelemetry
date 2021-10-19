--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.10.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: deletepc(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.deletepc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DELETE FROM activity WHERE activity.pcid = OLD.pcid;
	RETURN OLD;
END
$$;


--
-- Name: pcnamereplace(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.pcnamereplace() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	WITH q AS (
		INSERT INTO pcs("pcname") 
		VALUES (NEW.pcname)
		ON CONFLICT DO NOTHING 
		RETURNING pcid
	)
	
	INSERT INTO activity ("pcid", "app", "time")
		SELECT COALESCE(
			(SELECT pcid FROM q),
			(SELECT pcid FROM pcs WHERE pcname = NEW.pcname)
		), 
		NEW.app, 
		NEW."time";
		
	RETURN NULL;
END 
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity (
    "time" bigint NOT NULL,
    app text NOT NULL,
    innerid integer NOT NULL,
    pcid integer,
    pcname text
);


--
-- Name: activity_innerid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.activity ALTER COLUMN innerid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.activity_innerid_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999999
    CACHE 1
);


--
-- Name: pcs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pcs (
    pcid integer NOT NULL,
    pcname text,
    note text,
    clearance integer
);


--
-- Name: pcs_pcid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pcs_pcid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pcs_pcid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pcs_pcid_seq OWNED BY public.pcs.pcid;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    permid integer NOT NULL,
    permname text
);


--
-- Name: permissions_permid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_permid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_permid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_permid_seq OWNED BY public.permissions.permid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    username character varying(255) NOT NULL,
    hash character varying(255) NOT NULL,
    perms integer[]
);


--
-- Name: pcs pcid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pcs ALTER COLUMN pcid SET DEFAULT nextval('public.pcs_pcid_seq'::regclass);


--
-- Name: permissions permid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN permid SET DEFAULT nextval('public.permissions_permid_seq'::regclass);


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (innerid);


--
-- Name: pcs pcname_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pcs
    ADD CONSTRAINT pcname_unique UNIQUE (pcname);


--
-- Name: pcs pcs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pcs
    ADD CONSTRAINT pcs_pkey PRIMARY KEY (pcid);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: activity addpc; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER addpc BEFORE INSERT ON public.activity FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION public.pcnamereplace();


--
-- Name: pcs pc_delete; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER pc_delete BEFORE DELETE ON public.pcs FOR EACH ROW EXECUTE FUNCTION public.deletepc();


--
-- PostgreSQL database dump complete
--

