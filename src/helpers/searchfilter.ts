import moment from "moment";
import { ItemType, ReviewType } from "../types/item";
import { CommerceType } from "../types/user";

export const applyFilter = (arr: ItemType[], filter: any) => {
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

      case "open":
        let now = getMinutes(new Date());
        let day = moment(new Date()).day();

        aux = aux.filter((item) => {
          let bool = false;
          if (typeof item.commerce === "object") {
            item.commerce.schedules.forEach((sch) => {
              if (sch.day === day) {
                if (now >= getMinutes(sch.since) && now < getMinutes(sch.until))
                  bool = true;
              }
            });
          }
          if (bool) return item;
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

export const getStars = (item: ItemType | CommerceType) => {
  if (item.reviews.length > 0) {
    let aux = 0;
    item.reviews.forEach((rev) => {
      aux += rev.stars;
    });
    aux = aux / item.reviews.length;
    return parseFloat(aux.toFixed(2));
  } else return 0;
};

const getMinutes = (date: Date) =>
  moment(date).minute() + moment(date).hour() * 60;
const traslateDay = (num: number) => {
  switch (num) {
    case 1:
      return "Lun";
    case 2:
      return "Mar";
    case 3:
      return "Mie";
    case 4:
      return "Jue";
    case 5:
      return "Vie";
    case 6:
      return "Sab";
    case 7:
      return "Dom";

    default:
      break;
  }
};
