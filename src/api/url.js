// export const isOffline = true
export const isOffline = false
export const url = "http://192.168.1.114:4000/"

export const items = [
    {
        _id: "001",
        name: 'Sandalias con nombre raro y largo para hacer pruebas',
        price: 45.00,
        description: 'Lorem ipsum dolor sit amet consectetur. Dictum eget elementum metus eu aliquam libero elit odio facilisis. Leo elit id volutpat cursus leo ultrices scelerisque lobortis massa. Aliquet pulvinar...',
        categories: ['home', 'clean'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    },
    {
        _id: "002",
        name: 'Item 2',
        price: 1.00,
        description: '',
        categories: ['clean', 'cloth'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [{ stars: 4 }, { stars: 5 }, { stars: 2 }, { stars: 3 }],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    }, {
        _id: "003",
        name: 'Item 3',
        price: 29.99,
        description: '',
        categories: ['cloth', 'food'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    }, {
        _id: "004",
        name: 'Item 4',
        price: 5.99,
        description: '',
        categories: ['tech', 'others'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    }, {
        _id: "005",
        name: 'Item 1',
        price: 51.00,
        description: '',
        categories: ['others', 'home'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    }, {
        _id: "006",
        name: 'Item 6',
        price: 120.99,
        description: '',
        categories: ['tech'],
        owner_id: '0001',
        units_type: 1,
        favorites: [],
        reviews: [],
        images: [{ image: "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1702126567/tx8yim558ppykmgg6mdx.png" }],
    }
]

export const userOffline = {
    "_id": "6553461186511c6c924f89f4",
    "name": "Usuario Prueba1",
    "email": "prueba1@gmail.com",
    "avatar": 2,
    "card_id": "12.123.123",
    "commerce": false,
    "createdAt": "2023-11-14T10:04:01.849Z",
    "updatedAt": "2023-11-14T12:25:48.809Z",
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjU1MzQ2MTE4NjUxMWM2YzkyNGY4OWY0IiwiZXhwIjoxNzAyNzI0MzI5LCJpYXQiOjE3MDAxMzIzMjl9.I2oU-mYVdzhAjDHHg8M8BYQmubhI5BRGdy7ZIaTiAY0"
}

export const registerOffline = {
    "name": "Usuario Prueba4",
    "email": "prueba4@gmail.com",
    "avatar": 1,
    "card_id": "12.123.129",
    "password": "$2b$10$1ICIE./feabzfEIyWUB4peMmWUMbWqzT4pWLeaJncMLQfweI6ZFzu",
    "commerce": false,
    "_id": "655570d90bb58ff2e0918b34",
    "createdAt": "2023-11-16T01:31:05.262Z",
    "updatedAt": "2023-11-16T01:31:05.262Z",
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicHJ1ZWJhNEBnbWFpbC5jb20iLCJleHAiOjE3MDI2OTAyNjUsImlhdCI6MTcwMDA5ODI2NX0.0BU50Ls4BNEWkRmv2kpgHcNGT5UjEX2DU2BdmtvcRTA"
}

export const regCommerceOffline = {
    _id: "655347c571d0a0c0907d3dfa",
    name: "Commerce Test1",
    phone: "+584143684455",
    description: "Description for commerce 1",
    owner_id: "6553461186511c6c924f89f4",
    logo: "https://res.cloudinary.com/dhp2q7rls/image/upload/v1699956676/dkjhfrw244wb1q1vozih.png",
    logo_id: "dkjhfrw244wb1q1vozih",
    email: "commerce@gmail.com",
    address: "idk",
    rif: "",
    schedules: [],
    favorites: [],
    reviews: [],
    __v: 0,
    categories: [
        "Hogar"
    ]
}

/// Funcion general para el catch error que se usa en TODAS las peticiones 
export const catchError = async (err) => {
    /// Error
    if (err.response) {
        // console.log(err.response)
        // return { data: { msg: "No se ha contactado con el servidor" } }
        return { data: err.response.data, status: err.response.status }
        /// Error de mala conexion
    } else if (err.request) {
        // console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
        /// Error inesperado
    } else {
        // console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, intente nuevamente" } }
    }
}

/// TO DO:
/**
 * 
 * ✔ Dollar before price <NewItem> 
 * ✔ Load image picker spinner <NewItem>
 * ✔ <NewItem> Validations
 * ✔ <Register> Validations 
 * ✔ Upload <NewItem> to DB
 * ➰ Reviews load and show stars
 * ⏳ Create Reviews
 * ⏳ Edit Item from Commercial perspective
 * ⏳ Delete Item from Commercial Inventory
 * ⏳ Edit and Delete Items from Bulk ????
 * ⏳ Favorites logic
 * ⏳ Send Email Code (Email logic)
 * ⏳ Web Page
 * ⏳ Update / Link / Versions system
 * ⏳ Do pilot apk
 * ⏳ Instagram post/ account
 * 
 */