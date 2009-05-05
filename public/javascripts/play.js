var song = null;

function update_current(current){
    $('table#playlist tbody').find('tr').removeClass('current');
    $('table#playlist tbody tr:nth-child(' + current + ')').addClass('current');
}

function get_current(){
    var count   = 1;
    var current = 1;

    $('table#playlist tbody').find('tr').each(function(){
       if ($(this).attr('class').match('current')){
            current = count;
            return(false);
       }
       count += 1;
    });

    return(current);
}

function playlist(){
    list = []; 
    $('tr.song').each(function(){
      song = $(this).attr("data-path")
      server = $(this).attr("data-server")
      list.push("http://" + server + "/song?name=" + song)
    })
    return(list)
}


function play(){
    list = playlist();
    if (list.length > 0){

        current = get_current();
        if (current > list.length)
            current = 0
        update_current(current);

        song = list[current - 1];

        try{
            soundManager.destroySound('Player');
        }catch(e){}
        try{
            song = soundManager.createSound({
                id: 'Player',
                url: song,
                volume: 100,
                onfinish: next
                });
            song.play();
        }catch(e){
            alert(e)
        }
    }

    return(false);
}

function stop(){
    if (song != null){
        song.stop();
        song = null;
    }
    return(false);
}

function next(){
    current = get_current() + 1;
    update_current(current);
    play();
    return(false);
}

function prev(){
    current = get_current() - 1;
    update_current(current);
    play();
    return(false);
}

function init_soundmanager(){


   

    $('a.play').click(play)
    $('a.stop').click(stop)
    $('a.next').click(next)
    $('a.prev').click(prev)
}


