if('serviceWorker' in navigator){
    navigator.serviceWorker.register("../bubblebash/sw.js")
    .then((reg) => console.log("sw registered", reg))
    .catch(() => console.log("sw not registered"));
}