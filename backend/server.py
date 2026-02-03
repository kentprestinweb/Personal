from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ----- Models -----

class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_vegetarian: bool = False
    is_spicy: bool = False
    is_popular: bool = False

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_vegetarian: bool = False
    is_spicy: bool = False
    is_popular: bool = False

class CartItem(BaseModel):
    menu_item_id: str
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    order_type: str
    delivery_address: Optional[str] = None
    items: List[CartItem]
    total: float
    status: str = "pending"
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    order_type: str
    delivery_address: Optional[str] = None
    items: List[CartItem]
    total: float
    notes: Optional[str] = None

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NewsletterCreate(BaseModel):
    email: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    rating: int
    text: str
    date: str

# ----- Routes -----

@api_router.get("/")
async def root():
    return {"message": "Taco's & Things API"}

# Menu routes
@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(200)
    return items

@api_router.get("/menu/{category}", response_model=List[MenuItem])
async def get_menu_by_category(category: str):
    items = await db.menu_items.find({"category": category}, {"_id": 0}).to_list(100)
    return items

class UpdateImageRequest(BaseModel):
    name: str
    image_url: str

@api_router.put("/menu/update-image")
async def update_menu_image(request: UpdateImageRequest):
    result = await db.menu_items.update_many(
        {"name": request.name},
        {"$set": {"image_url": request.image_url}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": f"Updated {result.modified_count} item(s)", "name": request.name}

@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate):
    menu_item = MenuItem(**item.model_dump())
    doc = menu_item.model_dump()
    await db.menu_items.insert_one(doc)
    return menu_item

# Order routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    order_obj = Order(**order.model_dump())
    doc = order_obj.model_dump()
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Newsletter routes
@api_router.post("/newsletter", response_model=NewsletterSubscription)
async def subscribe_newsletter(subscription: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": subscription.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    sub_obj = NewsletterSubscription(**subscription.model_dump())
    doc = sub_obj.model_dump()
    await db.newsletter.insert_one(doc)
    return sub_obj

# Contact routes
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(contact: ContactCreate):
    contact_obj = ContactMessage(**contact.model_dump())
    doc = contact_obj.model_dump()
    await db.contact_messages.insert_one(doc)
    return contact_obj

# Reviews routes
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(50)
    return reviews

# Seed data endpoint
@api_router.post("/seed")
async def seed_data():
    # Clear existing menu items and reseed
    await db.menu_items.delete_many({})
    
    # Seed menu items - Full menu from Taco's & Things
    menu_items = [
        # Most Ordered
        {"id": str(uuid.uuid4()), "name": "Chips", "description": "Crispy, golden potato fries lightly seasoned with salt.", "price": 8.00, "category": "most-ordered", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chicken Tacos (3 tacos)", "description": "Perfectly spiced up chicken with tangy slaw and salsa", "price": 19.50, "category": "most-ordered", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Chicken (3 tacos)", "description": "Crispy fried chicken topped with fresh pico de gallo, drizzled with spicy sauce, and garnished with cilantro on soft tortillas.", "price": 20.90, "category": "most-ordered", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Fish (3 tacos)", "description": "Southern style fried tacos served with salsa", "price": 20.90, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Chicken Burger", "description": "Give it a go to this, you won't regret", "price": 20.50, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},
        {"id": str(uuid.uuid4()), "name": "Moroccan", "description": "Fish done with Moroccan spice", "price": 17.50, "category": "most-ordered", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Salt & Pepper Calamari", "description": "Make meal with chips & salad or brown rice & salad for an extra charge.", "price": 18.50, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Lemon Garlic Herb", "description": "Fish fillets done with garlic herb spice", "price": 14.99, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Small Tandoori Chicken Snack Pack", "description": "Hot chips topped with shredded tandoori chicken and homemade tandoori mayonnaise and garlic sauce", "price": 22.80, "category": "most-ordered", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},
        {"id": str(uuid.uuid4()), "name": "Mixture Platter", "description": "Mixture of Tacos, Calamari, Sliders, Fried Fish & Chips - Perfect option for 2 people to share.", "price": 75.00, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"},
        {"id": str(uuid.uuid4()), "name": "Special Paneer Wrap", "description": "Grilled paneer, onions, peppers, and a tangy chutney, wrapped in a soft tortilla.", "price": 19.99, "category": "most-ordered", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Calamari Chips", "description": "Crispy beer-battered fish with golden fries", "price": 10.40, "category": "most-ordered", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},

        # Desserts
        {"id": str(uuid.uuid4()), "name": "Gulab Jamun", "description": "Deep-fried milk and flour dumplings soaked in a sweet sugar syrup, often infused with cardamom and rose water.", "price": 7.00, "category": "desserts", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://customer-assets.emergentagent.com/job_fusion-tacos/artifacts/wygcvz0u_gulab%20jamun.jpg"},
        {"id": str(uuid.uuid4()), "name": "Gulab Jamun with Ice Cream", "description": "Soft, syrup-soaked dumplings paired with creamy vanilla ice cream, garnished with slivers of pistachio and almond.", "price": 10.50, "category": "desserts", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://customer-assets.emergentagent.com/job_fusion-tacos/artifacts/nt8h3zc3_gulab%20jamun%20with%20ice%20cream.webp"},

        # Snack Packs
        {"id": str(uuid.uuid4()), "name": "Large Tandoori Chicken Snack Pack", "description": "Hot chips topped with shredded tandoori chicken snack pack and homemade tandoori mayonnaise and garlic sauce", "price": 33.50, "category": "snack-packs", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://customer-assets.emergentagent.com/job_fusion-tacos/artifacts/fko3120w_Large%20tandoori%20chicken%20snack%20pack.webp"},
        {"id": str(uuid.uuid4()), "name": "Junior Tandoori Snack Pack", "description": "Tandoori-seasoned meat atop crispy fries, drizzled with creamy and tangy sauces.", "price": 17.99, "category": "snack-packs", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://customer-assets.emergentagent.com/job_fusion-tacos/artifacts/wqk65iij_Junior%20tandoori%20snack%20pack.webp"},
        {"id": str(uuid.uuid4()), "name": "Small Tandoori Chicken Snack Pack", "description": "Hot chips topped with shredded tandoori chicken and homemade tandoori mayonnaise and garlic sauce", "price": 22.80, "category": "snack-packs", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://customer-assets.emergentagent.com/job_fusion-tacos/artifacts/fyov1z6e_Small%20tandoori%20chicken%20snack%20pack.avif"},

        # Fish & Chips
        {"id": str(uuid.uuid4()), "name": "Tandoori Fish Chips and Salad", "description": "Grilled tandoori-seasoned fish fillet with crispy golden fries and a fresh mixed greens salad with red onions and cucumber.", "price": 22.50, "category": "fish-chips", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Moroccan Fish Chips and Salad", "description": "Seasoned fish fillet paired with crispy fries and a fresh garden salad with mixed greens, cucumber, and red onion.", "price": 21.90, "category": "fish-chips", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Moroccan Fish & Chips", "description": "Moroccan spices grilled fish served with hot chips and lemon wedge", "price": 18.50, "category": "fish-chips", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Lemon Herb Fish Chips and Salad", "description": "Grilled fish fillet with a lemon herb seasoning, served with crispy fries and a fresh salad of mixed greens, cucumber, and red onion.", "price": 21.90, "category": "fish-chips", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Crumbed Prawns Meal (5 prawns)", "description": "Golden crumbed prawns served with crispy fries, fresh greens, and a side of creamy dipping sauce.", "price": 23.00, "category": "fish-chips", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Sweet Chilli Prawn Skewers Meal", "description": "Four grilled prawns with sweet chilli sauce served with house salad and chips", "price": 23.50, "category": "fish-chips", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori Fish & Chips", "description": "Grilled tandoori-spiced fish fillet with crispy golden fries, garnished with fresh herbs, pickled onion and served with a lemon wedge.", "price": 18.50, "category": "fish-chips", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Lemon Herb Fish & Chips", "description": "Grilled lemon herb spiced fish served with hot chips and lemon", "price": 18.50, "category": "fish-chips", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},

        # Bit of Indian
        {"id": str(uuid.uuid4()), "name": "Chilli Chicken", "description": "Chicken fried and sautéed in spicy chili sauce, typically includes peppers and onions.", "price": 23.99, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},
        {"id": str(uuid.uuid4()), "name": "Punjabi Chicken Noodles", "description": "Tender chicken pieces and stir-fried noodles mixed with bell peppers and garnished with chopped green onions.", "price": 21.90, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400"},
        {"id": str(uuid.uuid4()), "name": "Special Chicken Wrap", "description": "Chicken taka tak wrap: Grilled chicken, lettuce, tomatoes, onions, and a tangy mint chutney in a soft tortilla.", "price": 22.00, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Special Paneer Wrap", "description": "Grilled paneer, onions, peppers, and a tangy chutney, wrapped in a soft tortilla.", "price": 19.99, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Paneer Pakora", "description": "Crispy, golden-brown paneer cubes fried in a spiced batter, garnished with fresh cilantro, served with tangy green chutney and pickled onions.", "price": 22.90, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Amritsari Fried Fish", "description": "Crispy fried fish marinated in Indian spices, garnished with cilantro, served with pickled onions and green chutney.", "price": 28.50, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Cheese Chilli", "description": "Fried cheese cubes typically tossed in a spicy chili sauce.", "price": 22.50, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Bhel Puri", "description": "A mixture of puffed rice, potatoes, onions, and assorted chutneys, offering a spicy and tangy flavor.", "price": 15.00, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400"},
        {"id": str(uuid.uuid4()), "name": "Achaari Chicken", "description": "Tender chicken pieces in a tangy, spiced curry sauce, garnished with fresh cilantro and julienned ginger.", "price": 26.99, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chicken Pakora", "description": "Crispy fried chicken pieces seasoned with Indian spices, garnished with cilantro. Served with tangy pickled onions and a side of green chutney.", "price": 26.50, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Achari Soya Chaap", "description": "Tender soya chaap pieces in a rich, spiced tomato gravy, garnished with fresh cilantro.", "price": 22.50, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Paneer Achaari", "description": "Tangy paneer cubes in a spiced pickling sauce, garnished with fresh cilantro.", "price": 25.50, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Soya Chaap Wrap", "description": "Marinated soya chaap with fresh vegetables, wrapped in a soft flatbread and drizzled with a green chutney.", "price": 20.99, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Soy Malai Chaap", "description": "Tender pieces of soy chaap in a creamy and aromatic malai sauce, garnished with fresh herbs.", "price": 22.90, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Creamy Mushroom Chicken", "description": "Tender chicken breasts in a rich, creamy mushroom sauce, garnished with fresh parsley.", "price": 25.99, "category": "indian", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},
        {"id": str(uuid.uuid4()), "name": "Crispy Soya Chaap Tacos", "description": "Crunchy taco shells filled with marinated soya chaap, fresh vegetables, and a zesty sauce, blending Indian flavors with a taco twist.", "price": 22.50, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Punjabi Noodle Tikki Burger", "description": "A spiced patty topped with crispy noodles, fresh lettuce, cucumber slices, and a hint of creamy sauce, all nestled in a sesame seed bun.", "price": 19.90, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},
        {"id": str(uuid.uuid4()), "name": "Punjabi Veg Noodles", "description": "Stir-fried noodles with bell peppers, green onions, and Indian spices.", "price": 20.50, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chilli Lime Potatoes", "description": "Crispy potatoes typically seasoned with a blend of chili and lime, offering a tangy and spicy flavor profile.", "price": 20.50, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Veg Manchurian", "description": "Vegetable dumplings in a savory sauce, garnished with chopped scallions, offering a fusion of flavors.", "price": 23.99, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Egg Bhurji", "description": "Spiced scrambled eggs with onions, tomatoes, and herbs.", "price": 24.99, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400"},
        {"id": str(uuid.uuid4()), "name": "Paneer Bhurji", "description": "Crumbled paneer cooked with spices, tomatoes, onions, and herbs, offering a savory and aromatic blend.", "price": 24.99, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tawa Roti", "description": "Soft, unleavened whole wheat flatbread, traditionally cooked on a griddle, perfect for pairing with various dishes.", "price": 3.50, "category": "indian", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"},
        {"id": str(uuid.uuid4()), "name": "Paneer Taka Tak", "description": "Paneer cubes sautéed with onion capsicum and tossed in homemade chilli sauce", "price": 23.99, "category": "indian", "is_vegetarian": True, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chicken Taka Tak", "description": "Marinated chicken breast fillets sautéed with onion capsicum and tossed in homemade chilli sauce", "price": 24.99, "category": "indian", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},

        # Tacos (set of 3)
        {"id": str(uuid.uuid4()), "name": "Chicken Tacos (3 tacos)", "description": "Perfectly spiced up chicken with tangy slaw and salsa", "price": 19.50, "category": "tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},

        # Tandoori Tacos (set of 3)
        {"id": str(uuid.uuid4()), "name": "Tandoori Paneer Tacos (3 tacos)", "description": "Vegetarian. If you are a paneer lover this is for you", "price": 22.50, "category": "tandoori-tacos", "is_vegetarian": True, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Crispy Soya Chaap Tacos", "description": "Crispy soya chaap marinated with Indian spices, served in a taco shell, typically includes lettuce, onions, and a zesty sauce.", "price": 18.00, "category": "tandoori-tacos", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori Chicken Tacos (3 tacos)", "description": "Why not try some Indian flavour in taco's", "price": 19.80, "category": "tandoori-tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori Fish Tacos (3 tacos)", "description": "Little bit Indian flavoured taco's", "price": 19.80, "category": "tandoori-tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400"},

        # Southern Tacos (set of 3)
        {"id": str(uuid.uuid4()), "name": "Southern Style Crispy Prawn Tacos", "description": "Crispy prawns with fresh cilantro and tangy slaw, wrapped in soft tortillas.", "price": 22.50, "category": "southern-tacos", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Chicken (3 tacos)", "description": "Crispy fried chicken topped with fresh pico de gallo, drizzled with spicy sauce, and garnished with cilantro on soft tortillas.", "price": 20.90, "category": "southern-tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Fish (3 tacos)", "description": "Southern style fried tacos served with salsa", "price": 20.90, "category": "southern-tacos", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400"},

        # Sharing Platter
        {"id": str(uuid.uuid4()), "name": "Salt & Pepper Calamari Chips and Salad", "description": "Lightly fried salt and pepper calamari with seasoned chips and mixed salad, served with tartare sauce and a lemon wedge.", "price": 23.50, "category": "sharing", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Platter for 3", "description": "A variety platter featuring mini burgers, crispy fried chicken strips, breaded fish sticks, and soft tacos topped with diced tomatoes, cilantro, and a drizzle of sauce.", "price": 112.00, "category": "sharing", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"},
        {"id": str(uuid.uuid4()), "name": "Mixture of Tacos, Calamari, Sliders, Fried Fish & Chips", "description": "Perfect option for 2 people to share.", "price": 75.00, "category": "sharing", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"},
        {"id": str(uuid.uuid4()), "name": "Salt & Pepper Calamari", "description": "Make meal with chips & salad or brown rice & salad for an extra charge.", "price": 18.50, "category": "sharing", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},

        # Burgers
        {"id": str(uuid.uuid4()), "name": "Southern Chicken Burger", "description": "Give it a go to this, you won't regret", "price": 20.50, "category": "burgers", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Fish Burger", "description": "Crispy fried fish fillet topped with cheddar cheese, fresh cilantro, and tangy coleslaw, all nestled in a soft bun.", "price": 20.00, "category": "burgers", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},

        # Kid's
        {"id": str(uuid.uuid4()), "name": "Calamari Chips", "description": "Crispy beer-battered fish with golden fries", "price": 10.40, "category": "kids", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Nuggets & Chips", "description": "Chicken nuggets typically served with crispy chips.", "price": 10.40, "category": "kids", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400"},

        # Sides
        {"id": str(uuid.uuid4()), "name": "Hot Salsa Loaded Chips", "description": "Crispy chips topped with hot salsa, jalapeños, spring onions, and corn relish.", "price": 13.50, "category": "sides", "is_vegetarian": True, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Water", "description": "Clear, refreshing bottled water.", "price": 4.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Panko Calamari Ring", "description": "Crispy panko-breaded calamari rings served with a side of fresh lemon wedges and garnished with herbs.", "price": 2.70, "category": "sides", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Garlic Aioli Sauce", "description": "A creamy, mayo-based dipping sauce typically featuring roasted garlic.", "price": 3.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chipotle Mayo Sauce", "description": "Housemade chipotle mayo sauce, typically includes a blend of smoky chipotle peppers and creamy mayonnaise for a slightly spicy kick.", "price": 3.50, "category": "sides", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400"},
        {"id": str(uuid.uuid4()), "name": "Mint Chutney", "description": "Typically includes fresh mint leaves, coriander leaves, ginger, and garlic.", "price": 3.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400"},
        {"id": str(uuid.uuid4()), "name": "Greek Pitta Bread", "description": "Soft Greek pitta bread, typically enjoyed as an accompaniment, often paired with ingredients like feta cheese, olives, and a drizzle of olive oil.", "price": 4.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"},
        {"id": str(uuid.uuid4()), "name": "Large Chips", "description": "House-cut fries typically seasoned with a special deluxe seasoning blend.", "price": 15.00, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Family Chips", "description": "Hand-cut potato chips, typically seasoned with sea salt and spices, offering a crispy texture suitable for sharing.", "price": 21.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Crumbed Prawn", "description": "Crispy, golden-brown shrimp coated in a Southern-style crumb, garnished with fresh parsley.", "price": 3.90, "category": "sides", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Papadum", "description": "Crispy Indian appetizer made from lentil flour and spices, perfect for snacking", "price": 4.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Sweet Chilli Mayo", "description": "Creamy mayonnaise blended with sweet and spicy chili, ideal for adding a touch of zest to various dishes.", "price": 3.00, "category": "sides", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori Mayo", "description": "A creamy mayonnaise infused with tandoori spices, offering a subtle blend of tangy and aromatic flavors, ideal as a dipping sauce.", "price": 3.00, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400"},
        {"id": str(uuid.uuid4()), "name": "Chips", "description": "Crispy, golden potato fries lightly seasoned with salt.", "price": 8.00, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Soft Drinks", "description": "Refreshing carbonated beverages", "price": 4.50, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400"},

        # Grilled Fish
        {"id": str(uuid.uuid4()), "name": "Moroccan", "description": "Fish done with Moroccan spice", "price": 17.50, "category": "grilled-fish", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Plain Fish Fillet", "description": "Simple grilled fish fillet", "price": 11.00, "category": "grilled-fish", "is_vegetarian": False, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Lemon Garlic Herb", "description": "Fish fillets done with garlic herb spice", "price": 14.99, "category": "grilled-fish", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori", "description": "Tandoori marinated fish fillet", "price": 15.99, "category": "grilled-fish", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
    ]
    
    await db.menu_items.insert_many(menu_items)
    
    # Seed reviews if not exist
    reviews_count = await db.reviews.count_documents({})
    if reviews_count == 0:
        reviews = [
            {"id": str(uuid.uuid4()), "author": "Sarah M.", "rating": 5, "text": "Every bite was a flavour explosion! The Tandoori Chicken Tacos are absolutely divine. Best fusion food in Melbourne!", "date": "2024-11-15"},
            {"id": str(uuid.uuid4()), "author": "James T.", "rating": 5, "text": "Great food quality and exotic flavours. The Masala Fries are addictive! Will definitely be coming back.", "date": "2024-11-10"},
            {"id": str(uuid.uuid4()), "author": "Priya K.", "rating": 5, "text": "Outstanding service and attention to detail. The fusion of Indian and Mexican cuisines is done perfectly.", "date": "2024-11-05"},
            {"id": str(uuid.uuid4()), "author": "Michael R.", "rating": 5, "text": "Hidden gem in Clyde North! The Butter Chicken Bowl is restaurant quality. Highly recommend!", "date": "2024-10-28"},
            {"id": str(uuid.uuid4()), "author": "Emma L.", "rating": 5, "text": "Family loved everything we ordered. The kids couldn't stop eating the Southern Chicken Tacos!", "date": "2024-10-20"},
        ]
        await db.reviews.insert_many(reviews)
    
    return {"message": "Menu updated successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
