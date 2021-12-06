CREATE DATABASE produse ENCODING 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

CREATE USER 'proiect' WITH ENCRYPTED PASSWORD 'proiect';
GRANT ALL PRIVILEGES ON DATABASE PRODUSE TO proiect;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA PUBLIC TO proiect;

CREATE TYPE tipuri_produse AS ENUM('miere', 'dulciuri', 'terapeutice');
CREATE TYPE facut_din AS ENUM('salcâm', 'tei', 'polifloră','rapiță','floarea soarelui','stup');
CREATE TYPE recipient AS ENUM('borcan din sticlă','borcan din plastic','ambalaj din plastic','sticlă');

CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300), 
   tip_produs tipuri_produse DEFAULT 'miere',
   facut_din facut_din DEFAULT 'polifloră',
   pret NUMERIC(8,2) NOT NULL, 
   gramaj INT NOT NULL CHECK (gramaj>=0),
   data_producerii TIMESTAMP DEFAULT current_timestamp,
   proprietati VARCHAR [], 
   recipient recipient NOT NULL,
   are_premiu BOOLEAN
);

INSERT into produse (nume, descriere, imagine, tip_produs, facut_din, pret, gramaj, proprietati, recipient, are_premiu) VALUES 
('Miere de salcâm 500g','Miere de salcâm este aproape incoloră, cu nuanțe de galben-pai spre galben deschis, având aroma florilor de salcam.','','miere','salcâm',27.50,500
,'{"ajută la tratarea ulcerului, insomniei, stresului", "conține glucide, proteine, substanțe minarale, vitamine", "cel mai mic potențial algergen","conținutul de glucoza este de 34.7%"}', 'borcan din sticlă', True),

('Miere de salcâm 1kg','Miere de salcâm este aproape incoloră, cu nuanțe de galben-pai spre galben deschis, având aroma florilor de salcam.','','miere','salcâm',52.50,1000
,'{"ajută la tratarea ulcerului, insomniei, stresului", "contine glucide, proteine, substante minarale, vitamine", "cel mai mic potențial algergen","conținutul de glucoza este de 34.7%"}', 'borcan din sticlă', True),

('Miere de tei 500g','Mierea de tei este una dintre cele mai aromate mieri. Particularitatea acesteia este dată de puterea liniștitoare pe care o are.','','miere','tei',25.20,500
,'{"ajută la tratarea insomniilor, răcelii, tusei", "anti-microbiene și anti-inflamatorii", "utilizată în tratarea crampelor și a bolilor renale"}', 'borcan din sticlă', True),

('Miere de tei 1kg','Mierea de tei este una dintre cele mai aromate mieri. Particularitatea acesteia este dată de puterea liniștitoare pe care o are.','','miere','tei',49.50,1000
,'{"ajută la tratarea insomniilor, răcelii, tusei", "anti-microbiene și anti-inflamatorii", "utilizată în tratarea crampelor și a bolilor renale"}', 'borcan din sticlă', True),

('Miere de rapiță 500g','Mierea de rapiță este o miere monoflorală, albicioasă-gălbuie, cu un conținul mare de glucoză și de coenzima Q3.','','miere','rapiță',25,500
,'{"ajută la tratearea osteoporozei și afecțiunilor rinichilor","pH mare, dar aciditate mică","se vinde cristalizată"}', 'borcan din sticlă', False),

('Miere de rapiță 1kg','Mierea de rapiță este o miere monoflorală, albicioasă-gălbuie, cu un conținul mare de glucoză și de coenzima Q3.','','miere','rapiță',49,1000
,'{"ajută la tratearea osteoporozei și afecțiunilor rinichilor","pH mare, dar aciditate mică","se vinde cristalizată"}', 'borcan din sticlă', False),

('Miere de floarea soarelui 500g','Mierea de floarea soarelui este o miere de culoare aurie, un adevărat miracol al naturii datorită conținutului de lecitină sub formă pură.','','miere','floarea soarelui',28.45,500
,'{"ajută la tratearea anemiei, oboselii","întărește sistemul imunitar", "este cea mai energizantă miere", "se vinde cristalizată","conține o cantitate mare de sediemente de polen, astfel că nu este recomandată personelor alergice la polen"}', 'borcan din sticlă', True),

('Miere de floarea soarelui 1kg','Mierea de floarea soarelui este o miere de culoare aurie, un adevărat miracol al naturii datorită conținutului de lecitină sub formă pură.','','miere','floarea soarelui',58.50,500
,'{"ajută la tratearea anemiei, oboselii","întărește sistemul imunitar", "este cea mai energizantă miere", "se vinde cristalizată","conține o cantitate mare de sediemente de polen, astfel că nu este recomandată personelor alergice la polen"}', 'borcan din sticlă', True),

('Miere polifloră 500g','Mierea polifloră este cea mai bogată miere în vitamine și săruri minerale, fiind obținută din nectarul mai multor flori','','miere','polifloră',23,500
,'{"ajută la tratearea anemiei și oboselii fizice","conține vitaminele B, C, K, calciu, fosfor, potasiu, glucoză și fructoză","recomandată pentru stimularea poftei de mâncare, îmbunătățirea activității inimii și ficatului"}', 'borcan din sticlă', True),

('Miere polifloră 1kg','Mierea polifloră este cea mai bogată miere în vitamine și săruri minerale, fiind obținută din nectarul mai multor flori','','miere','polifloră',44,1000
,'{"ajută la tratearea anemiei și oboselii fizice","conține vitaminele B, C, K, calciu, fosfor, potasiu, glucoză și fructoză","recomandată pentru stimularea poftei de mâncare, îmbunătățirea activității inimii și ficatului"}', 'borcan din sticlă', True),

('Bomboane cu miere și propolis','Bomboanele balsamice cu propolis în concentrație de 0,5% îmbină perfect aroma și beneficiile produselor apicole cu uleiul de eucalipt.','','dulciuri','polifloră',10,100
,'{"ajută la tratearea răcelii și a gâtului inflamat","nu conțin zahăr","adorate de copii"}', 'ambalaj din plastic', True),

('Jeleuri cu miere și ghimbir','Jeleurile sunt un desert inedit, un răsfăț dulce, nu doar pentru cei mici, ci și pentru cei mari.','','dulciuri','salcâm',10,100
,'{"ajută la întărirea imunității","nu conțin zahăr, colorant sau arome artificale","bogate în vitamina C"}', 'ambalaj din plastic', False),

('Ciocolată cu nuci și miere','Ciocolată de casă cu miere de albine și nuci crocante. Gust profund și aromat','','dulciuri','polifloră',7,100
,'{"nu conțin zahăr, colorant sau arome artificale"}', 'ambalaj din plastic', False),

('Caramele cu miere','Caramelele cu miere și lapte vor fi adorate de cei mici, fiind o gustare întotdeauna binevenită','','dulciuri','polifloră',12,250
,'{"nu conțin zahăr, colorant sau arome artificale","moi și delicioase"}', 'ambalaj din plastic', False),

('Miere cu scorțișoară 300g','Mierea cu scorțișoară este o miere cu un gust puternic și perfectă pentru deserturi. Îmbină proprietățile nutritive ale mierii și scorțișoarei','','dulciuri','polifloră',20,400
,'{"ajută la digestie ,imunitate și îngrijirea pielii","adjuvant în pierderea greutății"}', 'borcan din plastic', False),

('Miere cu cătină 500g','Mierea cu cătină este cea mai bună alegere când vine vorba de imunitate și vitamine.','','terapeutice','stup',20.30,350
,'{"ajută la întărirea imunității","vindecă virozele respiratorii","îmbunătățește funcția cardiovasculară","conține vitaminele A, C, complexul B, E, P, K, F"}', 'borcan din plastic', True),

('Lăptișor de matcă','Lăptișorul de matcă este 100% pur, recoltat direct din stup si neprelucrat','','terapeutice','stup',125,125
,'{"ajută la reducerea colesterolului din sânge și la prevenția cazurilor de răceală și gripă","întârzie procesul de îmbătrânire"}', 'sticlă', False),

('Păstură','Păstura este un aliment probiotic, bogat în fermenți lactici, având proprietăți mult mai valoroase decât polenul.','','terapeutice','stup',25, 50
,'{"ajută la tratarea infecțiilor și afecțiunilor digestive","previne și tratează anemiile","regenerează ficatul"}', 'borcan din sticlă', False);


CREATE TYPE roluri AS ENUM('admin', 'comun');


CREATE TABLE IF NOT EXISTS utilizatori (
   id serial PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   nume VARCHAR(100) NOT NULL,
   prenume VARCHAR(100) NOT NULL,
   parola VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   tema_site VARCHAR(10) NOT NULL,
   rol roluri DEFAULT 'comun',
   imagine VARCHAR(25),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS accesari (
   id serial PRIMARY KEY,
   ip VARCHAR(100) NOT NULL,
   user_id INT NULL REFERENCES utilizatori(id),
   pagina VARCHAR(100) NOT NULL,
   data_accesare TIMESTAMP DEFAULT current_timestamp
);


