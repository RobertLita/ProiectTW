const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Client } = require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs = require('ejs');
const formidable = require('formidable');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const html_to_pdf = require('html-pdf-node');
const request = require('request');

var app = express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

const client = new Client({
    host: 'localhost',
    user: 'proiect',
    password: 'proiect',
    database: 'produse',
    port: 5432
})
client.connect();

app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false
})); 

function getUtiliz(req){
	var utiliz;
	if(req.session){
		utiliz=req.session.utilizator
	}
	else{utiliz=null}
	return utiliz;
}


setInterval(function(){
    let comanda= `delete from accesari where now() - data_accesare > interval '10 minutes'`;
    //console.log(comanda);
    client.query(comanda, function(err, rez){
        if(err) console.log(err);
    });
},10*60*1000)


app.use(function(req,res, next){
    let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (req.ip){
        var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
        console.log("id_utiliz", id_utiliz);
        client.query(comanda_param, [req.ip, id_utiliz, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();
});

function get_categorii(){
    client.query("select unnest(enum_range( null::tipuri_produse)) as categorie", function(err,rezTip_Prod){
            app.locals.categorii = [];
            for(let i = 0; i < rezTip_Prod.rows.length; i++){
                app.locals.categorii.push(rezTip_Prod.rows[i]["categorie"]);
            }
    });
}

async function trimiteMail(email, nume, prenume,mesaj,cod){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{ 
			user:"celmaitareproiect@gmail.com",
			pass:"tehniciweb!123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	await transp.sendMail({
		from:"celmaitareproiect@gmail.com",
		to:email,
		subject: "Salut " + nume + prenume + "!",
		// text:"Username-ul tau este "+username,
        text: mesaj,
        html: cod,
		// html:"<h1>Te-ai înregistrat pe <a href = 'http://localhost:8080/'>Zumbee</a>!</h1><p>Username-ul tau este <i>"+username+"</i></p>",
	})
}

function verificaImagini1() {
    var textFisier = fs.readFileSync("resurse/json/galerie.json") 
    var jsi = JSON.parse(textFisier); 

    var caleGalerie = jsi.cale_galerie;
    let vectImagini = []
    for (let im of jsi.imagini) {
        var imVeche = path.join(caleGalerie, im.cale_relativa);
        var ext = path.extname(im.cale_relativa);
        var numeFisier = path.basename(im.cale_relativa, ext)
        let imNoua = path.join(caleGalerie + "/mic/", numeFisier + "-mic" + ".webp");
        let im_medie = path.join(caleGalerie + "/mediu/", numeFisier + "-mediu" + ".webp");
        let data = new Date();
        let ora = data.getHours();
        if ((ora >= 5 && ora < 12 && im.timp == "dimineata" && vectImagini.length < 6) 
        || (ora >= 12 && ora < 20 && im.timp == "zi" && vectImagini.length < 6) 
        || ( (ora >= 20 || ora < 5) && im.timp == "noapte" && vectImagini.length < 6)) 
        {
            vectImagini.push({ mare: imVeche, medie: im_medie, mic: imNoua, descriere: im.descriere }); //
            if (!fs.existsSync(imNoua))
                sharp(imVeche)
                    .resize(300) 
                    .toFile(imNoua, function (err) {
                        if (err)
                            console.log("eroare conversie", imVeche, "->", imNoua, err);
                    });
            if (!fs.existsSync(im_medie))
            sharp(imVeche)
                .resize(500) 
                .toFile(im_medie, function (err) {
                    if (err)
                        console.log("eroare conversie", imVeche, "->", im_medie, err);
                });
        }
    }
    return vectImagini;
}
function verificaImagini2() {
    var textFisier = fs.readFileSync("resurse/json/galerie.json") 
    var jsi = JSON.parse(textFisier); 

    var caleGalerie = jsi.cale_galerie;
    let vectImagini = [];
    for (let im of jsi.imagini) {
        var imVeche = path.join(caleGalerie, im.cale_relativa);
        var ext = path.extname(im.cale_relativa);
        var numeFisier = path.basename(im.cale_relativa, ext)
        let imNoua = path.join(caleGalerie + "/mic/", numeFisier + "-mic" + ".webp");
        if (im.galerie_animata == true) 
        {
            vectImagini.push({ mare: imVeche, mic: imNoua, descriere: im.descriere }); 
            if (!fs.existsSync(imNoua))
                sharp(imVeche)
                    .resize(300) 
                    .toFile(imNoua, function (err) {
                        if (err)
                            console.log("eroare conversie", imVeche, "->", imNoua, err);
                    });
        }
    }
    return vectImagini;
}


let parolaServer="tehniciweb";
app.post("/inreg",function(req, res){ 
    var username;
    let formular = formidable.IncomingForm();
	//nr ordine: 4
    formular.parse(req, function(err, campuriText, campuriFisier){
		eroare ="";
		if(campuriText.username=="" || !campuriText.username.match("^[A-Za-z]{1}[A-Za-z0-9_]{0,5}[0-9]{4}$")){
			eroare += "Username gresit.";
		}
        if(campuriText.nume == "")eroare += "Câmpul nume este gol.";
        if(campuriText.prenume == "")eroare += "Câmpul prenume este gol.";
        if(campuriText.parola == "")eroare += "Câmpul parolă este gol.";
        if(campuriText.rparola == "")eroare += "Câmpul reintroducere parolă este gol.";
        if(campuriText.email == "")eroare += "Câmpul email este gol.";

        if(campuriText.nume[0].toLowerCase() == campuriText.nume[0])eroare += "Numele începe cu literă mică.";
        if(campuriText.prenume[0].toLowerCase() == campuriText.prenume[0])eroare += "Prenumele începe cu literă mică.";
        if(!campuriText.parola.match("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"))eroare += "Parola nu respectă cerințele necesare.";
        comanda_verif= `select distinct 1 from utilizatori where username = $1::text`;
        client.query(comanda_verif, [campuriText.username], function(err, rez){
            //console.log(eroare);
            eroare += "Username-ul există deja.";
            if(rez.rowCount == 1){
                eroare += "Username-ul există deja.";
            }
            //console.log(eroare+'\n')
        })
        //console.log(eroare);
		if(!eroare){
            
			let parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
            //parolaCriptata.replace("\u0000","");
            //if(campuriText.poza == null)campuriText.poza="x";
			let comanda= `insert into utilizatori (username, nume, prenume, parola, email, tema_site, imagine) values ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text)`;
			client.query(comanda, [campuriText.username, campuriText.nume, campuriText.prenume, parolaCriptata, campuriText.email, campuriText.tema, campuriText.poza],function(err, rez){
				if (err){
                    //console.log(campuriText.username, campuriText.nume,campuriText.prenume, parolaCriptata, campuriText.email, campuriText.tema, campuriText.poza);
                    console.log(err);
					res.render("pagini/inregistrare",{err:"Eroare baza date! Reveniti mai tarziu", raspuns:"Datele nu au fost introduse."});
				}
				else{
					res.render("pagini/inregistrare",{err:"", raspuns:"Te-ai înregistrat cu succes!"});
                    let mesaj = "<h1>Te-ai înregistrat pe <a href = 'http://localhost:8080/'>Zumbee</a>!</h1><p>Username-ul tau este <i>"+campuriText.username+"</i></p>";
                    let text = "Username-ul tau este "+campuriText.username;
					trimiteMail(campuriText.email, campuriText.nume, campuriText.prenume,text, mesaj);
				}
			});
		}
		else{
				res.render("pagini/inregistrare",{err:"Eroare formular. "+eroare, raspuns:""});
		}
    });
	
	//nr ordine: 2
	formular.on("fileBegin", function(name,campFisier){
		//console.log("inceput upload: ", campFisier);
		if(campFisier && campFisier.name!=""){
			//am  fisier transmis
			var cale=__dirname+"/poze_uploadate/"+username
			if (!fs.existsSync(cale))
				fs.mkdirSync(cale);
			campFisier.path=cale+"/"+campFisier.name;
			//console.log(campFisier.path);
		}
	});	
	
	//nr ordine: 1
	formular.on("field", function(name,field){
		if(name=='username')
			username=field;
		//console.log("camp - field:", name)
	});
	
	//nr ordine: 3
	formular.on("file", function(name,field){
		//console.log("final upload: ", name);
	});
	
});

app.post("/login", function(req,res){
    let formular = formidable.IncomingForm();
    formular.parse(req, function(err, campuriText){
        //console.log(campuriText);
        let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
        //let comanda= `select username, nume,email, culoare_chat, rol from utilizatori where username= '${campuriText.username}' and parola='${parolaCriptata}'`;
        let comanda_param= `select id, username, nume, email, tema_site, rol from utilizatori where username= $1::text and parola=$2::text`;
        //console.log(comanda);
        
        client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
        //client.query(comanda, function(err, rez){
            if (!err){
                //console.log(rez);
                if (rez.rows.length == 1){
                    let poza = "/poza_uploadate" + "/" + rez.rows[0].username;
                    var img = "";
                    //console.log(poza);
                    if(fs.existsSync(poza)){
                        console.log("exista");
                        fs.readdirSync(testFolder).forEach(file => {
                            //console.log(file);
                          });
                    }
                    else {
                        img = "/poza_uploadate/default/def.png";
                        //console.log(img);
                    }
                    req.session.utilizator={
                        imagine: img,
                        id:rez.rows[0].id,
                        username:rez.rows[0].username,
                        nume:rez.rows[0].nume,
                        email:rez.rows[0].email,
                        tema_site:rez.rows[0].tema_site,
						rol:rez.rows[0].rol
                    }
                    console.log(req.session.utilizator.imagine);
                    if(req.session.utilizator.tema_site == "dark")app.locals.tema_site = "dark";
                    else app.locals.tema_site = "light";
                }
                
            }
            res.redirect("/index");
        });
    }); 
})

app.get('/useri', function(req, res){
	
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
            res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
        });
	} else{
		res.status(403).render('pagini/403',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
	}

});

app.post("/reset",function(req, res){
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
	var formular= formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
        let cod = [];
        for(let i = 97; i <= 122 ;i++){
            cod.push(String.fromCharCode(i));
            cod.push(String.fromCharCode(i-32));
        }
        let new_pass = "";
        for(let i = 1; i <= 7; i++){
            new_pass += cod[Math.floor(Math.random() * 52)];
        }
        let new_pass_cripata = crypto.scryptSync(new_pass, parolaServer, 32).toString('ascii');
        var comanda = `select * from utilizatori where id= $1::integer`;
        client.query(comanda,[campuriText.id_pass],function(eroare,rezz){
            var comanda2 = `UPDATE utilizatori SET parola = $1::text WHERE id = $2::integer;`;
            var text = "Parola contului tău ZumBee a fost schimbată.";
            var mesaj = "<p>Ne-am gândit că numa bine ai reușit să-ți reții în sfârșit parola așa că am schimbat-o într-una nouă: "+new_pass+".</p>";
            trimiteMail(rezz.rows[0].email, rezz.rows[0].nume, rezz.rows[0].prenume,text, mesaj);
            client.query(comanda2,[new_pass_cripata, campuriText.id_pass],function(error,Rez){
                //console.log(Rez);
            })
        })
	});
	}
	res.redirect("/useri");
	
});
app.post("/produse_cos",function(req, res){

    /* prelucrare pentru a avea toate id-urile numerice si pentru a le elimina pe cele care nu sunt numerice */
    var iduri=[]
    var cantitate = [];
    console.log(req.body);
    // for (let elem of req.body.ids_prod){
    //         iduri.push(elem[0]);
    //         cantitate.push(elem[1]);
    // }
    // if (iduri.length==0){
    //     res.send("eroare");
    //     return;
    // }

    // client.query("select id, nume, pret, gramaj, imagine from produse where id in ("+iduri+")", function(err,rez){
    //     console.log(err, rez);
    //     //console.log(rez.rows);
    //     res.send(rez.rows);
    // });
});

app.post("/cumpara",function(req, res){
    if(!req.session.utilizator){
        res.write("Nu puteți cumpăra dacă nu sunteți logat!");res.end();
        return;
    }
    client.query("select id, nume, pret, gramaj imagine from produse where id in ("+req.body.ids_prod+")", function(err,rez){
        let rezFactura=ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf-8"),{utilizator:req.session.utilizator,produse:rez.rows});
        let options = { format: 'A4' };
        let file = { content: rezFactura };
        html_to_pdf.generatePdf(file, options).then(function(pdf) {
            var numefis="temp/test"+(new Date()).getTime()+".pdf";
            fs.writeFileSync(numefis,pdf);
            trimitefactura(req.session.utilizator.username, req.session.utilizator.email, numefis);
            res.write("Totu bine!");res.end();
        });
    });
});

app.get("/logout", function(req, res){
    req.session.destroy();
    app.locals.tema_site="x";
    res.redirect("/index");
});

app.get(["/", "/index"], function (req, res) {
    var rezultat;
    client.query("select username from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare < interval '10 minutes' )").then(function(rezultat){
        console.log("rezultat", rezultat.rows);

        var locatie="";
        request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', 
            function (error, response, body) {
            if(error) {console.error('error:', error)}
            else{
                var obiectLocatie=JSON.parse(body);
                locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
            }
            var evenimente=[];
            var textFisier = fs.readFileSync("resurse/json/calendar.json") 
            var jsi = JSON.parse(textFisier); 
            for(let ev of jsi.evenimente){
                let data = ev.data.split('.');
                dataCurenta=new Date();
                evenimente.push({data: new Date(parseInt(data[2]),parseInt(data[1]) - 1,parseInt(data[0])) , text: ev.nume});
            }
            res.render("pagini/index", {evenimente: evenimente, ip:req.ip, locatie:locatie,utiliz_online: rezultat.rows, imagini1: verificaImagini1(),imagini2:verificaImagini2(), utilizator: req.session.utilizator});
            
            });

         
    }, function(err){console.log("eroare",err)});    
});


app.get("*/galerie-animata.css",function(req, res){
    res.setHeader("Content-Type","text/css");
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");
    nr_imagini=[9, 12, 15];
    let nr_imagini_random = nr_imagini[Math.floor(Math.random()*nr_imagini.length)];
    let rezScss=ejs.render(sirScss,{nr_img:nr_imagini_random});
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });
});

app.get(["*/galerie.json"], function (req, res){
        res.render("pagini/403",{utilizator: req.session.utilizator});
});

app.get("/produse",function(req, res){
    //console.log("Url:",req.url);
    //console.log("Query:", req.query.tip);
    // conditie_booleana? val_true : val_false
    let conditie= req.query.tip ?  " and tip_produs='"+req.query.tip+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    client.query("select id, nume, imagine, tip_produs, pret, descriere, gramaj, proprietati, data_producerii, facut_din, recipient, are_premiu from produse where 1=1"+conditie, function(err,rez){
        client.query("select unnest(enum_range( null::facut_din)) as tip_miere", function(err,rezTip){
            client.query("select unnest(enum_range( null::recipient)) as recipient", function(err,rezRec){
                res.render("pagini/produse", {produse:rez.rows, tipuri_produse:rezTip.rows, recipiente:rezRec.rows, utilizator: req.session.utilizator});
            })
        });
              
    });

    
});


app.get("/produs/:id_produs",function(req, res){
   
    const rezultat= client.query("select * from produse where id="+req.params.id_produs, function(err,rez){
        res.render("pagini/produs", {prod:rez.rows[0], utilizator: req.session.utilizator});
    });
});

app.get(["/despre"], function (req, res) {
        res.render("pagini/despre", { imagini1: verificaImagini1(), utilizator: req.session.utilizator});
});


app.get("/*",function(req, res){    
    res.render("pagini"+req.url, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404", {utilizator: req.session.utilizator});
            }
            else{ 
                console.log("Eroare pentru:", req.url);
                throw err;
            }
        }
        else{
            res.send(rezultatRandare);
        }
    });
});

verificaImagini1();
verificaImagini2();
get_categorii();

app.listen(8080);
console.log("Serverul a pornit!");