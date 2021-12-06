window.onload = function(){   
    var data = document.getElementsByClassName("data")[0];
    var luni = {'Jan': 'Ianuarie','Feb': 'Februarie','Mar': 'Martie','Apr': 'Aprilie','May':'Mai','Jun':'Iunie','Jul':'Iulie','Aug':'August','Sep':'Septembrie','Oct': 'Octombrie' ,'Nov':'Noiembrie','Dec':'Decembrie'};
    var zile = {'Mon':'Luni','Tue':'Marți','Wed':'Miercuri','Thu':'Joi','Fri':'Vineri','Sat':'Sâmbătă','Sun':'Duminică'};
    data_string = data.textContent.split(" ");
    var datanoua = '';
    datanoua = datanoua + data_string[2] + '-' + luni[data_string[1]] + '-' + data_string[3] + ' [' + zile[data_string[0]] +']';
    data.innerHTML = '';
    data.innerHTML = datanoua;
    var premiu = document.getElementsByClassName("premiu")[0];
        if(premiu.innerHTML == 'false'){
            premiu.innerHTML = ' ';
        }
        else{
            premiu.innerHTML = ' ';
            premiu.innerHTML = 'Acest produs a obținut premii pentru calitate.';
        }
} 