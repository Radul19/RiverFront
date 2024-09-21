
export const applyFilter = (arr, filter) => {
  if (!filter) {
    return arr;
  } else {
    let aux = [...arr];
    let order = filter.status === 1 ? -1 : 1;
    switch (filter.name) {
      case "price":
        aux.sort((a, b) => {
          if (a.price > b.price) return 1 * order;
          else if (a.price < b.price) return -1 * order;
          else return 0;
        });
        break;

      case "stars":
        aux.sort((a, b) => {
          if (getStars(a) > getStars(b)) return 1 * order;
          else if (getStars(a) < getStars(b)) return -1 * order;
          else return 0;
        });
        break;

      default:
        aux.sort((a, b) => {
          if (a.name > b.name) return 1;
          else if (a.name < b.name) return -1;
          else return 0;
        });
        break;
    }
    return aux;
  }
};

export const getStars = (item) => {
  if (item.reviews.length > 0) {
    let aux = 0
    item.reviews.forEach(rev => {
      aux += rev.stars
    });
    aux = aux / item.reviews.length
    return parseFloat(aux.toFixed(2))
  } else return 0
}