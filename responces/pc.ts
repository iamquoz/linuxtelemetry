import { IncomingMessage, ServerResponse } from "http";

import { indivpc } from "../sql";

export default function pc(req : IncomingMessage, res : ServerResponse, url : URL) {
    var query = url.searchParams.get('name');
    if (query) {

        indivpc(query)
            .then(reply => {
                res.end(reply.rows[0].pcname + "\n" + reply.rows.map(row => row.app + "\t\t\t" + timeConverter(row.time)).join('\n'));
            })
            .catch(err => console.log(err.stack));
        //res.end('done');
        res.statusCode = 200;
    }
    else {
        res.end('Bad Request');
        res.statusCode = 400;
    }
}

// god this is awful
// https://stackoverflow.com/a/6078873/16029300
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    //var months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }