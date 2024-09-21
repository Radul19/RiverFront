import { UserType } from "./user"

export type ImageType = {
    secure_url: string,
    public_id: string
}

export type ItemType = {
    _id: string,
    name: string,
    price: string,
    description: string,
    owner_id: string,
    categories: string[],
    favorites: string[],
    reviews: ReviewType[],
    images: ImageType[],
    createdAt: string,
    updatedAt: string
}
// } | undefined)

export type ReviewType = {
    _id: string,
    user: UserType,
    text: string,
    stars: number,
    createdAt: string,
    updatedAt: string
}

