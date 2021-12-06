window.onload=function(){

    var rng = document.getElementById("inp-pret");
	rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
	rng.parentNode.appendChild(document.createTextNode(rng.max));
    let spval = document.createElement("span");
	rng.parentNode.appendChild(spval)
    rng.value = 0;
    spval.innerHTML=" ("+rng.value+")";
    rng.onchange=function(){
        rng.nextSibling.nextSibling.innerHTML=" ("+this.value+")";
    }
    var data = document.getElementsByClassName("data");
    var luni = {'Jan': 'Ianuarie','Feb': 'Februarie','Mar': 'Martie','Apr': 'Aprilie','May':'Mai','Jun':'Iunie','Jul':'Iulie','Aug':'August','Sep':'Septembrie','Oct': 'Octombrie' ,'Nov':'Noiembrie','Dec':'Decembrie'};
    var zile = {'Mon':'Luni','Tue':'Marți','Wed':'Miercuri','Thu':'Joi','Fri':'Vineri','Sat':'Sâmbătă','Sun':'Duminică'};
    for(var i = 0; i < data.length; i++){
        data_string = data[i].textContent.split(" ");
        var datanoua = '';
        datanoua = datanoua + data_string[2] + '-' + luni[data_string[1]] + '-' + data_string[3] + ' [' + zile[data_string[0]] +']';
        data[i].innerHTML = '';
        data[i].innerHTML = datanoua;
    }
    var premiu = document.getElementsByClassName("premiu");
    for(var i = 0; i < premiu.length; i++){
        if(premiu[i].innerHTML == 'false'){
            premiu[i].innerHTML = ' ';
        }
        else{
            premiu[i].innerHTML = ' ';
            premiu[i].innerHTML = 'Acest produs a obținut premii pentru calitate.';
        }
    }

    let inp = document.getElementsByName("tip_miere");
    for(let i = 0; i < inp.length - 1; i++){
        inp[i].onchange = function(){
            inp[inp.length - 1].checked = false;
        }
    }

    document.getElementById("inp-pret").oninput = function() {
        var value = (this.value-this.min)  /(this.max-this.min)*100;
        this.style.background = 'linear-gradient(to right, var(--culoare_meniu) 0%, var(--culoare_meniu) ' + value + '%, #fff ' + value + '%, white 100%)';
      };

    let btn = document.getElementById("filtrare");
    btn.onclick = function(){
        function transf(c) {
            cc = ""
            c = c.toLowerCase(); 
            c = c.trim();
            let d = {'ă':'a','â':'a','î':'i','ș':'s','ț':'t'};
            for(let i = 0; i < c.length; i++){
                if("ăîâșț".includes(c[i])){
                    cc += d[c[i]];
                }
                else cc += c[i];
            }
            return cc;
        }
        
        let inp = document.getElementById("inp-pret");
        let maxPret = inp.value;

        inp = document.getElementById("inp-text");
        let val_text = inp.value;
        val_text = val_text.split(/[\s,]+/);
        if(val_text[0] == "")val_text = [];

        inp = document.getElementsByName("tip_miere");
        let val_tip_miere = [];
        for(let i = 0; i < inp.length; i++){
            if(inp[i].checked){
                val_tip_miere.push(inp[i].value);
            }
        } 
        if(val_tip_miere.length > 1){
            if(val_tip_miere[val_tip_miere.length - 1] == "toate")val_tip_miere.pop();
        }
        

        inp = document.getElementsByName("cantitate");
        let val_gramaj;
        for(let i = 0; i < inp.length; i++){
            if(inp[i].checked){
                val_gramaj = inp[i].value;
                break;
            }
        } 
        

        inp = document.getElementById("premii");
        let val_premiu = inp.value;
        

        inp = document.getElementsByName("recipient");
        let val_recipiente = [];
        for(let i = 0; i < inp.length; i++){
            if(inp[i].selected){
                val_recipiente.push(inp[i].value);
            }
        } 

        // inp = document.getElementsByName("textarea");
        // var nume_prod = inp.innerHTML;
        // console.log(nume_prod);

        var produse = document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="none";
            let pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let conditie1 = (pret <= maxPret);
            
        
            let conditie2;
            if(val_text.length > 0){
                conditie2 = false;
                let prop = prod.getElementsByClassName("val-proprietati")[0].innerHTML;
                let val_prop = prop.split(',');
                for(let cuv of val_text){
                    cuv = transf(cuv);
                    for(let prop of val_prop){
                        prop = transf(prop);
                        console.log(prop);
                        if(prop.includes(cuv) === true){
                            conditie2 = true;
                            break;
                        }
                    }
                    if(conditie2 == true)break;
                }
            }
            else conditie2 = true;

            let tip_miere = prod.getElementsByClassName("val-tip-miere")[0].innerHTML;
            let conditie3 = false;
            if(val_tip_miere[0] == "toate")conditie3 = true;
            for(let i = 0; i < val_tip_miere.length; i++){
                if(val_tip_miere[i].trim() === tip_miere.trim()){
                    conditie3 = true;
                    break;
                }
            }
            
            let gramaj = prod.getElementsByClassName("val-gramaj")[0].innerHTML;
            let conditie4 = false;
            if(val_gramaj == "toate")conditie4 = true;
            else if(parseInt(gramaj) == parseInt(val_gramaj))conditie4 = true;
            
            let tip_recipient = prod.getElementsByClassName("val-recipient")[0].innerHTML;
            let conditie5 = true;
            for(let i = 0; i < val_recipiente.length; i++){
                if(val_recipiente[i].trim() === tip_recipient.trim()){
                    conditie3 = false;
                    break;
                }
            }

            let premiu = prod.getElementsByClassName("val-premiu")[0].innerHTML;
            if(premiu == "Acest produs a obținut premii pentru calitate.")premiu = "true";
            else premiu = "false";
            let conditie6 = false;
            if(premiu === val_premiu || val_premiu === "toate")conditie6 = true;

            let conditie7 = true;
            // let nume = prod.getElementsByClassName("val-nume")[0].innerHTML;
            // if(nume_prod === "" || transf(nume).includes(transf(nume_prod))) conditie7 = true;

            let conditieFinala = conditie1 && conditie3 && conditie4 && conditie6 && conditie5 && conditie2 && conditie7;
            if(conditieFinala)
                prod.style.display="flex";            
        }       
    }


    function sortArticole(factor){
        
        var produse = document.getElementsByClassName("produs");
        let arrayProduse = Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            let sub1 = art1.getElementsByClassName("val-tip-miere")[0].innerHTML;
            let sub2 = art2.getElementsByClassName("val-tip-miere")[0].innerHTML;
            let r = sub1.localeCompare(sub2);
            if(r == 0){
                let pret1 = parseInt(art1.getElementsByClassName("val-pret")[0].innerHTML);
                let pret2 = parseInt(art2.getElementsByClassName("val-pret")[0].innerHTML);
                return factor * (pret1 - pret2); 
            };
            return factor * r;
        });
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn = document.getElementById("sortCrescNume");
    btn.onclick = function(){
        sortArticole(1);
    }
    btn = document.getElementById("sortDescrescNume");
    btn.onclick = function(){
        sortArticole(-1);
    }

    btn = document.getElementById("resetare");
    btn.onclick=function(){
        var produse = document.getElementsByClassName("produs");
        for (let prod of produse){
            prod.style.display="flex";
        }
        let inp = document.getElementById("inp-pret");
        inp.value = inp.min;
        spval.innerHTML=" ("+ inp.min +")";
        inp.oninput();

        inp = document.getElementById("inp-text");
        inp.value = "";

        inp = document.getElementsByName("tip_miere");
        for(let i = 0; i < inp.length - 1 ; i++)
            if(inp[i].checked)inp[i].checked = false;
        inp[inp.length - 1].checked = true;

        inp = document.getElementsByName("cantitate");
        inp[0].checked = false;
        inp[1].checked = false;
        inp[2].checked = true;

        inp = document.getElementById("premii");
        inp.value = "toate";

        inp = document.getElementById("inp-recipient");
        inp.value = "";
    }


    window.onkeydown=function(e){
        
       
        if (e.key=="c" && e.altKey){
            e.preventDefault();
            var produse = document.getElementsByClassName("produs");
            sumaArt = 0;
            for (let prod of produse){
                if(prod.style.display != "none")
                    sumaArt += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            sumaArt = sumaArt.toFixed(2); 
            const d = document.createElement("div");
            const p = document.createTextNode("Suma produselor este " + sumaArt + " lei");
            d.appendChild(p);
            d.classList.add("divsuma");
            document.body.appendChild(d);
            setTimeout(function(){
                d.parentNode.removeChild(d);
            }, 2500);
        }
    }
    
    if(!localStorage["produse_selectate"]){
        ids_produse_init = [];
        localStorage["produse_selectate"] = JSON.stringify(ids_produse_init);
    }
    var ok = 0;
    var butoane = document.getElementsByClassName("adauga buton1 b3");
    for (let i = 0; i< butoane.length; i++){
        butoane[i].onclick=function(){
            ok = 0;
            let p_id = parseInt(document.getElementsByClassName("id_prod")[i].value);
            let cantitate =  parseInt(document.getElementsByClassName("in_cant")[i].value);
            ids_produse = JSON.parse(localStorage["produse_selectate"]);
            for(let j = 0; j < ids_produse.length;j++)
                if(ids_produse[j][0] == p_id){
                    ids_produse[j][1] += cantitate;
                    ok = 1;
                }
            if(ok == 0)ids_produse.push([p_id, cantitate]);
            console.log(ids_produse);
            localStorage["produse_selectate"] = JSON.stringify(ids_produse);
            console.log(localStorage);
        }        
    }
}