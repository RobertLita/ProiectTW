window.addEventListener("DOMContentLoaded",function(){
    let temaSelectata = localStorage.getItem("tema")
    if(temaSelectata=="dark")
        document.body.classList.add("dark");
    var btn = document.getElementById("schimbare-tema");
    if (btn){
        btn.onclick=function(){
            document.body.classList.toggle("dark");
            if (document.body.classList.contains("dark"))
                localStorage.setItem("tema","dark")
            else
                localStorage.setItem("tema","light")
        }
    }
});
window.onload = function(){
    if(document.getElementById("tema_site")){
        let t = document.getElementById("tema_site").innerHTML;
        if(t == "dark" || t=="light"){
            let temaSelectata = localStorage.getItem("tema")
            if(temaSelectata=="dark")
                document.body.classList.add("dark");
            if(t == "dark")document.body.classList.toggle("dark",true);
            else if(t == "light")document.body.classList.toggle("dark",false);
                if (document.body.classList.contains("dark"))
                    localStorage.setItem("tema","dark")
                else
                    localStorage.setItem("tema","light")
            document.getElementById("tema_site").remove();
        }
        
    }
}
