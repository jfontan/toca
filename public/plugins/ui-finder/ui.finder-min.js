;(function(c){if(!window.debug){window.debug=function(){var a=(c.browser.mozilla)?arguments:c.makeArray(arguments).join(', ');if(typeof console=='object'){console.log(a);return}}}var C=function(){var a=arguments;var b=new Date().valueOf(),d=(C.d2)?b-C.d2:0;d=d/1000;if(window.console&&!window.console.not){console.log(d+'\n\t'+c.makeArray(a).join())}else{c('body').append('<p>'+d+': '+c.makeArray(a).join('<br>')+'</p>')}C.d2=b};c.fn.finder=function(x,r){var D={title:'',url:false,onInit:function(a){},onRootReady:function(a,b){},onItemSelect:function(a,b,d){},onItemOpen:function(a,b,d){},onFolderSelect:function(a,b,d){},onFolderOpen:function(a,b,d){},processData:function(a){return c('<div class="ui-finder-content"/>').append(a)},animate:true,cache:false,ajax:{cache:false},listSelector:false,maxWidth:450,classNames:{'ui-finder':'ui-widget ui-widget-header ui-corner-all','ui-finder-wrapper':'ui-widget-content ui-corner-all','ui-finder-header':'','ui-finder-title':'','ui-finder-list-item-file':'ui-icon-document','ui-finder-list-item-folder':'ui-icon-folder-collapsed','ui-finder-icon-folder-arrow':'ui-icon ui-icon-triangle-1-e'},toolbarActions:function(){return''}};var y=c.Finders=c.Finders||{};var E=function(){return parseInt(new Date().valueOf(),10)};var z=c.scrollTo||false;if(typeof z=='function'){z=true;c.scrollTo.defaults.axis='xy';c.scrollTo.defaults.duration=900}var s,u,F=(typeof r=='string')?r:null,G=(typeof r=='function')?r:null,H=arguments;if(typeof x=='string'){s=x}else if(typeof x=='object'){u=x}if(u){u=jQuery.extend(D,u)}else{u=D}function p(a,b){var d=this;this.cache={};this._0=[];this.settings={};this.id=b;this.initial=c(a).clone(true);this.element=c(a);this.element.attr('data-finder-ts',this.id);for(var e in u){d.settings[e]=u[e]}return this};p.prototype.init=function(){var e=this,h=this.settings.toolbarActions.apply(this.element)||'',i=this.settings.classNames,n=i['ui-finder']||'',j=i['ui-finder-wrapper']||'',q=i['ui-finder-header']||'',f=i['ui-finder-title']||'';this.element.wrap('<div class="ui-finder '+n+'"/>').wrap('<div class="ui-finder-wrapper '+j+'"/>').wrap('<div class="ui-finder-container"/>');this.wrapper=this.element.parents('.ui-finder-container');this.wrapper.parents('.ui-finder').prepend('<div class="ui-finder-header '+q+'">'+h+'</div>').prepend('<div class="ui-finder-title '+f+'">'+this.settings.title+'</div>');this.widget=this.wrapper.parents('.ui-finder');this.wrapper.unbind('click.FinderSelect').bind('click.FinderSelect',function(a){var b=a.target,d=c(b);if(!d.closest('li.ui-finder-list-item').length&&!d.is('> li.ui-finder-list-item').length||d.parents('.ui-finder-column').length===0){return}e.queue(d);return false});c('.ui-state-default',this.widget).hover(function(){c(this).addClass('ui-state-hover')},function(){c(this).removeClass('ui-state-hover')});setTimeout(function(){e.settings.onInit.apply(e.element,[e]);e.settings.listItemBorderColour=c('.ui-widget-header').css('backgroundColor');e.selectItem('root')},0);return this};p.prototype.queue=function(a,b,d){var e=this,h=this.wrapper;this._0.push([a,b,d]);if(!this.isProcessing){this.preSelect()}return this};p.prototype.preSelect=function(){var a=this._0;if(a.length==0){return}this.select.apply(this,a[0]);return this};p.prototype.select=function(d,e,h){var i=this,n=this.wrapper,j=(typeof d=='string')?c('a[rel="'+d+'"]',n):c(d),q=j;if(typeof d.length!='number'){debug('Target must be either a URL or a jQuery/DOM element');return this}if(!j[0]){debug('Target element does not exist',d);return this}this.isProcessing=true;var f=j.closest('li.ui-finder-list-item'),g=c('> a:first',f),l=f.parents('div[data-finder-list-level]:first'),o=l.attr('data-finder-list-level'),m=(f.hasClass('ui-finder-file'))?'file':'folder',w=g.attr('rel'),t=c('div.ui-finder-column:visible',n);j=(j[0]!==f[0]&&j[0]!==g[0])?f:j;if(h=='select'&&typeof d=='string'&&m=='file'){j=f}c('.ui-finder-list-item.ui-state-hover',n).removeClass('ui-state-hover');t.each(function(){var a=c(this),b=a.attr('data-finder-list-level');if(b>=o){c('.ui-finder-list-item.ui-state-default',a).removeClass('ui-state-default')}if(b>o){a.remove()}});f.addClass('ui-state-default').addClass('ui-state-hover');if(z){setTimeout(function(){l.scrollTo(f)},0)}var v,k=[f,q,i];if(m=='file'){v=i.settings.onItemSelect.apply(i.element,k)}else{v=i.settings.onFolderSelect.apply(i.element,k)}if(v!==false){f.addClass('ui-finder-loading');i.selectItem(w,e,[j,f]);return this}this.adjustWidth(true);this.finalise();return this};p.prototype.selectItem=function(f,g,l){var o=this,m=o.settings,w=(l)?l[0]:null,t=(l)?l[1]:null,v=(t)?t[0].className.match(/(file|folder)/)[0]:'folder',k=(f=='root')?(m.url)?null:this.element:c('> ul, > ol, > div',t).eq(0).clone(),f=(f=='root'&&typeof m.url=='string')?m.url:f;var A=function(n){var j=m.processData,q=k;if(c.isFunction(j)){k=j(k);if(!k.length){k=q}}else{k=c(k)}o.cache[f]={'url':f,'data':k,'response':q,'date':new Date().valueOf(),'status':'success'};if(f=='root'&&typeof m.onRootReady=='function'){m.onRootReady.apply(o,[k,o])}if(v=='folder'){c('> ul, > ol',k).eq(0).find('> li').each(function(){var a=c(this),b,d;if(a.hasClass('ui-finder-folder')){b='folder'}else if(a.hasClass('ui-finder-file')){b='file'}else{if(a.children('ul,ol').length){a.addClass('ui-finder-folder');b='folder'}else{a.addClass('ui-finder-file');b='file'}}d=(b=='file')?m.classNames['ui-finder-list-item-file']:m.classNames['ui-finder-list-item-folder'];a.addClass('ui-finder-list-item').css('borderColor',m.listItemBorderColour).append('<span class="'+m.classNames['ui-finder-icon-folder-arrow']+'									ui-finder-icon ui-finder-icon-arrow"/>');var e=c('> a',this),h=e.attr('href')||'_1'+new Date().valueOf(),i=e.attr('title')||'';if(e.attr('rel')==h.substring(1)||!h.length){return}e.attr('rel',h).attr('href','#'+h).append('<span class="ui-icon '+d+' ui-finder-icon ui-finder-icon-'+b+'"/>');if(i.length==0){e.attr('title',h)}})}o.appendNewColumn(f,k,[w,t],v)};if(k&&k.length&&!g){A()}else if(k&&k.length&&g&&f.match(/_blank\d+/)){A()}else if(typeof this.cache[f]=='object'&&this.settings.cache&&!g){if(this.cache[f].status=='success'){k=this.cache[f].data;A()}}else if(!f.match(/_blank\d+/)){c.ajax({url:f,cache:o.settings.ajax.cache,success:function(a){k=a},complete:function(){A()}})}return this};p.prototype.appendNewColumn=function(a,b,d,e){var h=this,i=(d)?d[0]:null,n=(d)?d[1]:null,j=(n)?n.parents('div[data-finder-list-level]:first'):null,q=a.replace(/[\W\s]*/g,''),f=(function(){if(a==h.settings.url||a=='root'){return 0}return parseInt(j.attr('data-finder-list-level'),10)+1})();var g=c('div[data-finder-list-id="'+q+'"]');if(g.length>0){g[0].parentNode.removeChild(g[0])}g=c('<div class="ui-finder-column ui-widget-content ui-finder-new-col"/>').css('display','none').attr('data-finder-list-id',q).attr('data-finder-list-source',a).attr('data-finder-list-level',f).css('z-index',0);h.wrapper[0].appendChild(g[0]);g[0].appendChild(c(b)[0]);setTimeout(function(){h.adjustWidth(false,g)},0);if(i&&i[0]&&i.is('a')){var l=[n,g,h];if(e=='file'){h.settings.onItemOpen.apply(h.element,l)}else{h.settings.onFolderOpen.apply(h.element,l)}}return this};p.prototype.adjustWidth=function(a,b){var d=this,e=this.wrapper;b=b||c('div[data-finder-list-id]:visible:last',e);var h=(!a)?e.children('div[data-finder-list-id]:not(.ui-finder-new-col):visible'):e.children('div[data-finder-list-id]:visible:not(:last)'),i=0;b.removeClass('ui-finder-new-col');h.css('right','auto');e.toggleClass('rebuild').toggleClass('rebuild');h.each(function(){i+=c(this).width()});var n=(c.browser.msie&&c.browser.version<8)?10:5,j=(!b.data('yscroll'))?n:0;var q=b.width(),f=(d.settings.maxWidth&&q>d.settings.maxWidth)?d.settings.maxWidth:q+j,g=i+f,l=e.width(),o=e.parent().width();b.data('yscroll',true);if(g>o||g<l&&l>o&&g!=l){if(f==g||g<o){g='auto'}j=(g!='auto'&&g!=l)?n:'';e.width(g+j)}b.css('left',i);b.css('right',0);b.css('z-index',2);b.css({'display':'block','visibility':'hidden'});if(b&&z){this.wrapper.parent().scrollTo(b)}if(!a&&this.settings.animate){var m=(!isNaN(this.settings.animate))?this.settings.animate:500;var w=b.css('left').replace(/\D/g,''),t=e.width()-w;b.css('overflow-y','hidden').css('right',t).css('visibility','visible').animate({'right':0},{duration:m,complete:function(){b.css('overflow-y','scroll');d.finalise(b)}})}else{b.css('visibility','visible');d.finalise(b)}return this};p.prototype.finalise=function(a){c('div.ui-finder-column .ui-finder-list-item.ui-finder-loading',this.wrapper).removeClass('ui-finder-loading');this.isProcessing=false;this._0.shift();if(this._0.length>0){this.preSelect()}return this};p.prototype.destroy=function(){this.wrapper.unbind('click.FinderSelect').unbind('click.FinderPreview');this.element.parents('.ui-finder').replaceWith(this.initial);delete y[this.id];return this};p.prototype.current=function(){var a=c('.ui-state-hover',this.wrapper).find('a:first');return(a.length>0)?a:null};p.prototype.refresh=function(){var a=this.current();if(a){this.queue(a,true)}else{this.selectItem('root',true)}return this};var B=y[c(this).eq(0).attr('data-finder-ts')];if(s=='current'&&B){return B.current()}else if(s=='get'&&B){return B}return this.each(function(){var a=c(this).attr('data-finder-ts')||null,b=new Date().valueOf();if(a&&s){var d=y[a];if(s=='select'&&r){if(r.constructor==Array){r=r.reverse();for(var e=r.length-1;e>=0;e--){d.queue(r[e],false,s)}}else{d.queue(r,false,s)}}else if(s=='destroy'){d.destroy()}else if(s=='refresh'){d.refresh()}}else if(!s){y[b]=new p(this,b).init()}else if(!a&&s){debug('Element is not a finder')}})}})(jQuery);