export function setCookie(name, value, time) {
    let expires = "";
    if (time) {
        let date = new Date();
        date.setTime(date.getTime() + (time * 1000)); // in seconds
        expires = "; expires=" + date.toUTCString();
    }
    console.log(name + "=" + (value || "") + expires + "; path=/");
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
  
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
        }
    }
    return "";
}


  