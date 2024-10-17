import { ReviewType } from "./item"

export type UserType = {
    _id?: string,
    name: string,
    email: string,
    avatar: number,
    card_id: string,
    commerce?: CommerceType,
    createdAt?: string,
    updatedAt?: string,
}


export type CommerceType = {
    _id: string,
    name: string,
    phone: string,
    description: string,
    owner_id: string,
    logo: string,
    logo_id: string,
    email: string,
    address: string,
    rif: string,
    delivery: boolean,
    reviews: ReviewType[],
    socials: SocialType,
    schedules: ScheduleType[],
    categories: string[],
    favorites: string[],
    createdAt?: string,
    updatedAt?: string,
}

type SocialType = {
    telegram?: string,
    whatsapp?: string,
    messenger?: string,
    instagram?: string,
}

// export type Review = {
//     user: string | UserType,
//     text: string,
//     stars: string,
//     _id: string,
//     createdAt: string,
//     updatedAt: string,
// }

export type ScheduleType = {
    "since": Date
    "until": Date
    day: number
    _id: number
}