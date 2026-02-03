from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
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
    category: str  # tacos, curries, fusion, sides, drinks
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
    order_type: str  # dine-in, takeaway, delivery
    delivery_address: Optional[str] = None
    items: List[CartItem]
    total: float
    status: str = "pending"  # pending, confirmed, preparing, ready, delivered
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
    return {"message": "Tacos & Things API"}

# Menu routes
@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(100)
    return items

@api_router.get("/menu/{category}", response_model=List[MenuItem])
async def get_menu_by_category(category: str):
    items = await db.menu_items.find({"category": category}, {"_id": 0}).to_list(100)
    return items

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
    # Check if already subscribed
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
    # Check if data already exists
    menu_count = await db.menu_items.count_documents({})
    if menu_count > 0:
        return {"message": "Data already seeded"}
    
    # Seed menu items
    menu_items = [
        # Tacos
        {"id": str(uuid.uuid4()), "name": "Tandoori Paneer Taco", "description": "Smoky tandoori-spiced paneer with mint chutney, pickled onions, and cilantro in a soft corn tortilla", "price": 8.50, "category": "tacos", "is_vegetarian": True, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
        {"id": str(uuid.uuid4()), "name": "Tandoori Chicken Taco", "description": "Juicy tandoori chicken with raita, mango salsa, and fresh herbs", "price": 9.50, "category": "tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"},
        {"id": str(uuid.uuid4()), "name": "Southern Chicken Taco", "description": "Crispy southern-fried chicken with coleslaw and chipotle mayo", "price": 9.00, "category": "tacos", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400"},
        {"id": str(uuid.uuid4()), "name": "Moroccan Fish Taco", "description": "Spiced fish with harissa aioli, preserved lemon, and arugula", "price": 10.50, "category": "tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400"},
        {"id": str(uuid.uuid4()), "name": "Crispy Calamari Taco", "description": "Golden calamari with sriracha lime sauce and Asian slaw", "price": 11.00, "category": "tacos", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400"},
        {"id": str(uuid.uuid4()), "name": "Fried Chicken Taco", "description": "Classic fried chicken with honey mustard, pickles, and jalapeños", "price": 9.50, "category": "tacos", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1562059390-a761a084768e?w=400"},
        
        # Curries
        {"id": str(uuid.uuid4()), "name": "Butter Chicken Bowl", "description": "Creamy tomato-based curry with tender chicken, served with basmati rice", "price": 16.50, "category": "curries", "is_vegetarian": False, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"},
        {"id": str(uuid.uuid4()), "name": "Paneer Tikka Masala", "description": "Grilled paneer in rich spiced tomato gravy with naan bread", "price": 15.50, "category": "curries", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Lamb Rogan Josh", "description": "Slow-cooked lamb in aromatic Kashmiri spices", "price": 18.50, "category": "curries", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1545247181-516773cae754?w=400"},
        
        # Fusion
        {"id": str(uuid.uuid4()), "name": "Tikka Quesadilla", "description": "Cheese quesadilla filled with tikka chicken, peppers, and spiced mayo", "price": 14.50, "category": "fusion", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400"},
        {"id": str(uuid.uuid4()), "name": "Masala Nachos", "description": "Crispy nachos loaded with spiced mince, cheese, jalapeños, and raita", "price": 13.50, "category": "fusion", "is_vegetarian": False, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Curry Burrito", "description": "Large flour tortilla stuffed with curry chicken, rice, beans, and chutney", "price": 15.00, "category": "fusion", "is_vegetarian": False, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
        
        # Sides
        {"id": str(uuid.uuid4()), "name": "Masala Fries", "description": "Crispy fries dusted with chaat masala and served with mint chutney", "price": 7.50, "category": "sides", "is_vegetarian": True, "is_spicy": True, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400"},
        {"id": str(uuid.uuid4()), "name": "Samosa Bites", "description": "Mini samosas with tamarind and mint dipping sauces", "price": 8.00, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400"},
        {"id": str(uuid.uuid4()), "name": "Guacamole & Chips", "description": "Fresh house-made guacamole with crispy tortilla chips", "price": 9.00, "category": "sides", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400"},
        {"id": str(uuid.uuid4()), "name": "Elote (Mexican Corn)", "description": "Grilled corn with lime, chili, cotija cheese, and mayo", "price": 6.50, "category": "sides", "is_vegetarian": True, "is_spicy": True, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400"},
        
        # Drinks
        {"id": str(uuid.uuid4()), "name": "Mango Lassi", "description": "Creamy yogurt-based mango drink", "price": 5.50, "category": "drinks", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1626201850129-a96cf52c4833?w=400"},
        {"id": str(uuid.uuid4()), "name": "Horchata", "description": "Traditional Mexican rice milk with cinnamon", "price": 5.00, "category": "drinks", "is_vegetarian": True, "is_spicy": False, "is_popular": False, "image_url": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400"},
        {"id": str(uuid.uuid4()), "name": "Masala Chai", "description": "Spiced Indian tea with milk", "price": 4.50, "category": "drinks", "is_vegetarian": True, "is_spicy": False, "is_popular": True, "image_url": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400"},
    ]
    
    await db.menu_items.insert_many(menu_items)
    
    # Seed reviews
    reviews = [
        {"id": str(uuid.uuid4()), "author": "Sarah M.", "rating": 5, "text": "Every bite was a flavour explosion! The Tandoori Chicken Tacos are absolutely divine. Best fusion food in Melbourne!", "date": "2024-11-15"},
        {"id": str(uuid.uuid4()), "author": "James T.", "rating": 5, "text": "Great food quality and exotic flavours. The Masala Fries are addictive! Will definitely be coming back.", "date": "2024-11-10"},
        {"id": str(uuid.uuid4()), "author": "Priya K.", "rating": 5, "text": "Outstanding service and attention to detail. The fusion of Indian and Mexican cuisines is done perfectly.", "date": "2024-11-05"},
        {"id": str(uuid.uuid4()), "author": "Michael R.", "rating": 5, "text": "Hidden gem in Clyde North! The Butter Chicken Bowl is restaurant quality. Highly recommend!", "date": "2024-10-28"},
        {"id": str(uuid.uuid4()), "author": "Emma L.", "rating": 5, "text": "Family loved everything we ordered. The kids couldn't stop eating the Southern Chicken Tacos!", "date": "2024-10-20"},
    ]
    
    await db.reviews.insert_many(reviews)
    
    return {"message": "Data seeded successfully"}

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
