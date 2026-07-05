export interface User {
  _id: string
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  avatar?: { url: string }
  phoneNo?: string
  aboutInfo?: string
  userPackage: 'Free' | 'Gold' | 'Platinum'
  wishlist: string[]
  lastActive?: string
  createdAt: string
}

export interface ProductImage {
  featuredImg: { url: string }
  imageOne?: { url: string }
  imageTwo?: { url: string }
  imageThree?: { url: string }
}

export interface ProductLocation {
  province: string
  city: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  bidStatus: 'Live' | 'Expired'
  category: 'Vehicles' | 'Property' | 'MiscProducts'
  subCategory: string
  images: ProductImage
  location: ProductLocation
  features?: string[]
  user: User
  endDate: string
  createdAt: string
  status?: 'Pending' | 'Approved' | 'Rejected'
  bidTime?: number
  // Vehicle-specific
  make?: string
  model?: string
  year?: string
  fuelType?: string
  kmsDriven?: string
  // Property-specific
  furnished?: 'furnished' | 'unfurnished'
  bedrooms?: number
  bathrooms?: number
  area?: number
  areaUnit?: string
}

export interface Bid {
  _id: string
  product: string
  bidders: Array<{
    user: User
    price: number
    createdAt: string
  }>
}

export interface Conversation {
  _id: string
  members: string[]
  lastMessage?: string
  lastMessageSender?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  conversationId: string
  sender: string
  text: string
  createdAt: string
}

export interface Notification {
  _id: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}
