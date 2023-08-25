import { Service } from '@/api/request'


export const existsPermission = (name) => {
    var operates = sessionStorage.getItem('operate_permission');
    operates = JSON.parse(operates);
    var is_exists = false;
    for (var i in operates) {
        if (operates[i].name == name) {
            is_exists = true;
            break;
        }
    }
    return is_exists;
}


export const formatDate = (date) => {
    var d = new Date(date);
    var y = d.getFullYear();
    var m = (d.getMonth() + 1).toString().padStart(2, "0");
    var r = d.getDate().toString().padStart(2, "0");
    var hh = d.getHours().toString().padStart(2, "0");
    var mm = d.getMinutes().toString().padStart(2, "0");
    var ss = d.getSeconds().toString().padStart(2, "0");
    return `${y}-${m}-${r} ${hh}:${mm}:${ss}`;
}


