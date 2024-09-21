export default card_id_dots = (text) => {
    text = text.replaceAll(".", "");
    let aux = text.split("");
    if(aux[0]==="0") return ''
    let aux2 = aux.reverse();
    for (let i = 0; i < aux.length; i++) {
        if (i === 3 || i === 7) {
            aux.splice(i, 0, ".");
        }
    }
    let aux3 = aux2.reverse();
    let aux4 = aux3.toString()
    return aux4.replaceAll(",", "");
};