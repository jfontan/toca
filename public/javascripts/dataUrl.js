function dataUrl(data, mimeType){ // turns a string into a url that appears as a file. (to ff/op/saf)
   encType= (!!btoa) ? ";base64" : "";
   var esc = (!!encType) ? function(d){return btoa(d);} : function(d){return escape(d);};
   if(!mimeType){mimeType= (data.nodeName) ? "text\/html" :"text\/plain";}; 
   b="data:"+mimeType+";charset="+document.characterSet+";"+encType+",";
   
    if ("string number date boolean function".indexOf(typeof data) > -1){ b+=esc(data.toString()); return b; };  
    if ( data.constructor==Array){b+= esc( data.join("") ); return b;  };
  if(typeof data=="xml"){b+=esc(data.toSource()); return b;} //FF2 xml frag/doc
    //for more complicated data, attempt to determine the format.
  if(typeof data=="object"){ 
      if(!!data.value && !!data.value.length){b+=esc(data.value); return b;}; //input tags w/content
      if(!!data.innerHTML){b+=esc(data.innerHTML); return b;} //HTML tag
      if(!!data.length){    //weird stuff like nodelists
      var G=function(ob){r=[]; i=0; 
        for(i;i<ob.length;i++){
        if(dataUrl(ob[i])) r[i]=dataUrl(ob[i]);} return r.join("\n");};//end g
        return  (b+G(data));}//end if object w/length 
      if(!! eval(data.toSource()) ){b+=esc(data.toSource()); return b;}; //JSON
    }//end if object 
 return;
}  //end function dataUrl

function dataUrlStr(data){ return ("data:text\/html,"+escape(data));}
