--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.10.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.10.1)

-- Started on 2021-10-22 00:44:01 +04

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
-- TOC entry 210 (class 1255 OID 16433)
-- Name: deletepc(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.deletepc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DELETE FROM activity WHERE activity.pcid = OLD.pcid;
	RETURN OLD;
END
$$;


ALTER FUNCTION public.deletepc() OWNER TO postgres;

--
-- TOC entry 209 (class 1255 OID 16430)
-- Name: pcnamereplace(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.pcnamereplace() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 16388)
-- Name: activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity (
    "time" bigint NOT NULL,
    app text NOT NULL,
    innerid integer NOT NULL,
    pcid integer,
    pcname text
);


ALTER TABLE public.activity OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16405)
-- Name: activity_innerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 206 (class 1259 OID 16417)
-- Name: pcs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pcs (
    pcid integer NOT NULL,
    pcname text,
    note text,
    clearance integer
);


ALTER TABLE public.pcs OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16415)
-- Name: pcs_pcid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pcs_pcid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pcs_pcid_seq OWNER TO postgres;

--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 205
-- Name: pcs_pcid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pcs_pcid_seq OWNED BY public.pcs.pcid;


--
-- TOC entry 207 (class 1259 OID 16437)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    permname text,
    permid integer NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16455)
-- Name: permissions_permid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_permid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_permid_seq OWNER TO postgres;

--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 208
-- Name: permissions_permid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_permid_seq OWNED BY public.permissions.permid;


--
-- TOC entry 204 (class 1259 OID 16407)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(255) NOT NULL,
    hash character varying(255) NOT NULL,
    perms integer[]
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3009 (class 2604 OID 16420)
-- Name: pcs pcid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcs ALTER COLUMN pcid SET DEFAULT nextval('public.pcs_pcid_seq'::regclass);


--
-- TOC entry 3010 (class 2604 OID 16457)
-- Name: permissions permid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN permid SET DEFAULT nextval('public.permissions_permid_seq'::regclass);


--
-- TOC entry 3012 (class 2606 OID 16404)
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (innerid);


--
-- TOC entry 3016 (class 2606 OID 16429)
-- Name: pcs pcname_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcs
    ADD CONSTRAINT pcname_unique UNIQUE (pcname);


--
-- TOC entry 3018 (class 2606 OID 16425)
-- Name: pcs pcs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcs
    ADD CONSTRAINT pcs_pkey PRIMARY KEY (pcid);


--
-- TOC entry 3020 (class 2606 OID 16465)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permid);


--
-- TOC entry 3014 (class 2606 OID 16414)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- TOC entry 3021 (class 2620 OID 16432)
-- Name: activity addpc; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER addpc BEFORE INSERT ON public.activity FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION public.pcnamereplace();


--
-- TOC entry 3022 (class 2620 OID 16434)
-- Name: pcs pc_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER pc_delete BEFORE DELETE ON public.pcs FOR EACH ROW EXECUTE FUNCTION public.deletepc();


-- Completed on 2021-10-22 00:44:01 +04

--
-- PostgreSQL database dump complete
--

