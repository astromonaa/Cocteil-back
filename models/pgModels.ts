import sequelize from '../db'
import { DataTypes } from 'sequelize'

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  activationLink: { type: DataTypes.STRING },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false }
})

const Cart = sequelize.define('Cart', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CartProduct = sequelize.define('CartProduct', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  quantity: {type: DataTypes.INTEGER, allowNull: false},
  color: {type: DataTypes.STRING, allowNull: false},
  size: {type: DataTypes.INTEGER, allowNull: false}
})


const Product = sequelize.define('Product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING},
  price: {type: DataTypes.FLOAT, allowNull: false},
  rating: {type: DataTypes.INTEGER},
  images: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
  sizes: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
  colors: {type: DataTypes.ARRAY(DataTypes.STRING)}
})


const Category = sequelize.define('Category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true}
})

const SubCategory = sequelize.define('SubCategory', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false }
})


const Token = sequelize.define('Token', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  refreshToken: {type: DataTypes.STRING, allowNull: false}
})

const Favorite = sequelize.define('Favorite', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const FavoriteProduct = sequelize.define('FavoriteProduct', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})



User.hasOne(Cart)
Cart.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

Cart.hasMany(CartProduct)
CartProduct.belongsTo(Cart)


Category.hasMany(Product)
Product.belongsTo(Category)

SubCategory.hasMany(Product)
Product.belongsTo(SubCategory)

Category.hasMany(SubCategory)
SubCategory.belongsTo(Category)


Product.hasMany(CartProduct)
CartProduct.belongsTo(Product)

User.hasOne(Favorite)
Favorite.belongsTo(User)

Favorite.hasMany(FavoriteProduct)
FavoriteProduct.belongsTo(Favorite)

Product.hasMany(FavoriteProduct)
FavoriteProduct.belongsTo(Product)

export {
  User,
  Cart,
  Product,
  CartProduct,
  Category,
  Token,
  SubCategory,
  Favorite,
  FavoriteProduct
}