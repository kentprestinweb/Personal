from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import hashlib
import secrets
import base64
import shutil
import ssl
import certifi
import pandas as pd
import io
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection with SSL support for MongoDB Atlas
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')

# Add SSL parameters for MongoDB Atlas connections (mongodb+srv://)
if 'mongodb+srv' in mongo_url or 'mongodb.net' in mongo_url:
    # Use certifi for SSL certificates
    client = AsyncIOMotorClient(
        mongo_url,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000
    )
else:
    # Local MongoDB connection
    client = AsyncIOMotorClient(mongo_url)

db = client[os.environ.get('DB_NAME', 'portfolio_db')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Simple token storage (in production, use Redis or similar)
active_tokens = {}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token not in active_tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return active_tokens[token]

# ----- Portfolio Models -----

class PortfolioProject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: List[str] = []
    featured: bool = False
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PortfolioProjectCreate(BaseModel):
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: List[str] = []
    featured: bool = False
    order: int = 0

class PortfolioProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    featured: Optional[bool] = None
    order: Optional[int] = None

# ----- Service Models -----

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str = "code"
    order: int = 0

class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str = "code"
    order: int = 0

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None

# ----- Testimonial Models -----

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    role: str
    company: Optional[str] = None
    text: str
    image_url: Optional[str] = None
    rating: int = 5
    order: int = 0

class TestimonialCreate(BaseModel):
    author: str
    role: str
    company: Optional[str] = None
    text: str
    image_url: Optional[str] = None
    rating: int = 5
    order: int = 0

class TestimonialUpdate(BaseModel):
    author: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    text: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[int] = None
    order: Optional[int] = None

# ----- Skill Models -----

class Skill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # "frontend", "backend", "tools", "other"
    icon: Optional[str] = None
    order: int = 0

class SkillCreate(BaseModel):
    name: str
    category: str
    icon: Optional[str] = None
    order: int = 0

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None

# ----- Contact Message Model -----

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactCreate(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str

# ----- Admin Models -----

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCredentialsUpdate(BaseModel):
    current_password: str
    new_username: Optional[str] = None
    new_password: Optional[str] = None

# ----- Section Visibility Model -----
class SectionVisibility(BaseModel):
    about: bool = True
    services: bool = True
    portfolio: bool = True
    testimonials: bool = True
    contact: bool = True

class SectionVisibilityUpdate(BaseModel):
    about: Optional[bool] = None
    services: Optional[bool] = None
    portfolio: Optional[bool] = None
    testimonials: Optional[bool] = None
    contact: Optional[bool] = None

# Default section visibility
DEFAULT_SECTION_VISIBILITY = {
    "about": True,
    "services": True,
    "portfolio": True,
    "testimonials": True,
    "contact": True
}

# ----- Site Content Model -----
class SiteContent(BaseModel):
    # Hero Section
    hero_name: str = "Kent Angelo Prestin"
    hero_title: str = "Web Developer"
    hero_subtitle: str = "Creating Beautiful & Functional Websites"
    hero_tagline: str = "I transform ideas into stunning digital experiences. Specializing in modern, responsive web development with a focus on user experience and clean code."
    hero_cta_text: str = "View My Work"
    hero_cta_url: str = "#portfolio"
    hero_image: Optional[str] = None
    
    # About Section
    about_label: str = "About Me"
    about_headline: str = "Passionate Web Developer Based in Australia"
    about_bio: str = "I'm Kent Angelo Prestin, a dedicated web developer with a passion for creating beautiful, functional websites that help businesses grow and succeed online. With expertise in modern web technologies, I deliver solutions that are not only visually appealing but also performant and user-friendly."
    about_bio_2: str = "From concept to deployment, I handle every aspect of web development with care and attention to detail. My goal is to build websites that not only look great but also drive results for my clients."
    about_image: Optional[str] = None
    about_years_experience: str = "2+"
    about_projects_completed: str = "10+"
    about_clients_satisfied: str = "5+"
    
    # Services Section
    services_label: str = "What I Do"
    services_headline: str = "Services I Offer"
    services_description: str = "I provide comprehensive web development services to help bring your digital vision to life."
    
    # Portfolio Section
    portfolio_label: str = "My Work"
    portfolio_headline: str = "Featured Projects"
    portfolio_description: str = "Here are some of my recent projects. Each one represents my commitment to quality and attention to detail."
    
    # Testimonials Section
    testimonials_label: str = "Testimonials"
    testimonials_headline: str = "What Clients Say"
    testimonials_description: str = "Don't just take my word for it - hear from the businesses I've helped."
    
    # Contact Section
    contact_label: str = "Get In Touch"
    contact_headline: str = "Let's Work Together"
    contact_description: str = "Have a project in mind? I'd love to hear about it. Get in touch and let's create something amazing together."
    contact_email: str = "kent@example.com"
    contact_phone: str = ""
    contact_location: str = "Australia"
    
    # Social Links
    linkedin_url: str = ""
    github_url: str = ""
    twitter_url: str = ""
    facebook_url: str = ""
    instagram_url: str = ""
    
    # Footer
    footer_tagline: str = "Building Digital Experiences That Matter"
    footer_copyright: str = "© 2025 Kent Angelo Prestin. All rights reserved."

class SiteContentUpdate(BaseModel):
    hero_name: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_tagline: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_url: Optional[str] = None
    hero_image: Optional[str] = None
    about_label: Optional[str] = None
    about_headline: Optional[str] = None
    about_bio: Optional[str] = None
    about_bio_2: Optional[str] = None
    about_image: Optional[str] = None
    about_years_experience: Optional[str] = None
    about_projects_completed: Optional[str] = None
    about_clients_satisfied: Optional[str] = None
    services_label: Optional[str] = None
    services_headline: Optional[str] = None
    services_description: Optional[str] = None
    portfolio_label: Optional[str] = None
    portfolio_headline: Optional[str] = None
    portfolio_description: Optional[str] = None
    testimonials_label: Optional[str] = None
    testimonials_headline: Optional[str] = None
    testimonials_description: Optional[str] = None
    contact_label: Optional[str] = None
    contact_headline: Optional[str] = None
    contact_description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    footer_tagline: Optional[str] = None
    footer_copyright: Optional[str] = None

# ----- Default Content -----
DEFAULT_CONTENT = {
    "hero_name": "Kent Angelo Prestin",
    "hero_title": "Turn Local Searches Into Local Customers",
    "hero_subtitle": "Websites for Tradies & Local Businesses",
    "hero_tagline": "I build high-performance websites for electricians, plumbers, and tradies who want to dominate their local area. More visibility. More calls. More growth.",
    "hero_headline": None,  # Uses default in frontend
    "hero_cta_text": "Get Your Free Quote",
    "hero_cta_url": "#contact",
    "hero_image": None,
    "hero_stat_calls": "500+",
    "hero_stat_ranking": "#1",
    "about_label": "Why Work With Me",
    "about_headline": "Your Local Business Deserves to Be Found",
    "about_bio": "I specialise in helping tradies and local service businesses get more customers online. Unlike generic web designers, I understand what local businesses need – a website that ranks in Google, builds trust instantly, and turns visitors into paying customers.",
    "about_bio_2": "From electricians to plumbers, landscapers to builders – I've helped local businesses across Australia get found online and grow their customer base. No fluff, no jargon – just results-driven websites that work as hard as you do.",
    "about_image": None,
    "about_years_experience": "2+",
    "about_projects_completed": "10+",
    "about_clients_satisfied": "5+",
    "services_label": "What I Do",
    "services_headline": "Built for Local Growth",
    "services_description": "I provide everything your tradie business needs to win online – from Google-friendly websites to local SEO that puts you on the map.",
    "portfolio_label": "My Work",
    "portfolio_headline": "Local Businesses I've Helped",
    "portfolio_description": "Real results for real businesses. Check out the websites I've built for tradies and local service providers.",
    "testimonials_label": "Success Stories",
    "testimonials_headline": "What Local Business Owners Say",
    "testimonials_description": "Don't just take my word for it – hear from the tradies and business owners I've helped grow.",
    "contact_label": "Get Started",
    "contact_headline": "Ready to Grow Your Local Business?",
    "contact_description": "Let's chat about how a professional website can help you get more calls, more jobs, and more growth. Free consultation – no pressure, no jargon.",
    "contact_email": "kent@example.com",
    "contact_phone": "",
    "contact_location": "Australia",
    "linkedin_url": "",
    "github_url": "",
    "twitter_url": "",
    "facebook_url": "",
    "instagram_url": "",
    "footer_tagline": "Helping Local Businesses Win Online",
    "footer_copyright": "© 2025 Kent Angelo Prestin. All rights reserved."
}

# Default services - Focused on Tradies & Local Business
DEFAULT_SERVICES = [
    {
        "id": str(uuid.uuid4()),
        "title": "Tradie Websites",
        "description": "Professional, mobile-friendly websites built specifically for tradies. Show off your work, build trust, and get more enquiries.",
        "icon": "wrench",
        "order": 1
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Local SEO",
        "description": "Get found when locals search for your services. I'll optimise your site to rank in Google Maps and local search results.",
        "icon": "map-pin",
        "order": 2
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Google Business Setup",
        "description": "Complete Google Business Profile setup and optimisation to get you showing up in local searches and Google Maps.",
        "icon": "search",
        "order": 3
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Lead Generation",
        "description": "Websites designed to convert visitors into customers. Click-to-call buttons, contact forms, and quote requests that work.",
        "icon": "phone",
        "order": 4
    }
]

# Default portfolio project
DEFAULT_PORTFOLIO = [
    {
        "id": str(uuid.uuid4()),
        "title": "Taco's & Things",
        "description": "A modern, professional restaurant website for an Indian-Mexican fusion taco truck. Features include online ordering integration, menu management, photo gallery, and admin dashboard.",
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/n2cl794d_1.jpg",
        "live_url": "",
        "technologies": ["React", "FastAPI", "MongoDB", "Tailwind CSS"],
        "featured": True,
        "order": 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

# Default skills
DEFAULT_SKILLS = [
    {"id": str(uuid.uuid4()), "name": "React", "category": "frontend", "icon": "react", "order": 1},
    {"id": str(uuid.uuid4()), "name": "JavaScript", "category": "frontend", "icon": "javascript", "order": 2},
    {"id": str(uuid.uuid4()), "name": "HTML/CSS", "category": "frontend", "icon": "html", "order": 3},
    {"id": str(uuid.uuid4()), "name": "Tailwind CSS", "category": "frontend", "icon": "tailwind", "order": 4},
    {"id": str(uuid.uuid4()), "name": "Python", "category": "backend", "icon": "python", "order": 5},
    {"id": str(uuid.uuid4()), "name": "FastAPI", "category": "backend", "icon": "fastapi", "order": 6},
    {"id": str(uuid.uuid4()), "name": "Node.js", "category": "backend", "icon": "nodejs", "order": 7},
    {"id": str(uuid.uuid4()), "name": "MongoDB", "category": "backend", "icon": "mongodb", "order": 8},
    {"id": str(uuid.uuid4()), "name": "Git", "category": "tools", "icon": "git", "order": 9},
    {"id": str(uuid.uuid4()), "name": "Figma", "category": "tools", "icon": "figma", "order": 10},
]

# ----- Routes -----

@api_router.get("/")
async def root():
    return {"message": "Kent Angelo Prestin Portfolio API"}

# ----- Public Routes -----

# Get site content (public)
@api_router.get("/content")
async def get_site_content():
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        return DEFAULT_CONTENT
    return content

# Get portfolio projects (public)
@api_router.get("/portfolio", response_model=List[PortfolioProject])
async def get_portfolio():
    projects = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not projects:
        return DEFAULT_PORTFOLIO
    return projects

# Get services (public)
@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not services:
        return DEFAULT_SERVICES
    return services

# Get testimonials (public)
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return testimonials

# Get skills (public)
@api_router.get("/skills", response_model=List[Skill])
async def get_skills():
    skills = await db.skills.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not skills:
        return DEFAULT_SKILLS
    return skills

# Submit contact form (public)
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(contact: ContactCreate):
    contact_obj = ContactMessage(**contact.model_dump())
    doc = contact_obj.model_dump()
    await db.contact_messages.insert_one(doc)
    return contact_obj

# Get section visibility (public)
@api_router.get("/section-visibility")
async def get_section_visibility():
    visibility = await db.section_visibility.find_one({}, {"_id": 0})
    if not visibility:
        return DEFAULT_SECTION_VISIBILITY
    return visibility

# ----- Admin Routes -----

# Initialize admin credentials if not exists
@app.on_event("startup")
async def init_admin():
    admin = await db.admin.find_one({})
    if not admin:
        await db.admin.insert_one({
            "username": "kentprestin",
            "password": hash_password("portfolio2025"),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info("Admin credentials initialized")

# Initialize site content
@app.on_event("startup")
async def init_site_content():
    content = await db.site_content.find_one({})
    if not content:
        await db.site_content.insert_one(DEFAULT_CONTENT.copy())
        logger.info("Site content initialized")
    
    # Initialize services if empty
    services_count = await db.services.count_documents({})
    if services_count == 0:
        await db.services.insert_many(DEFAULT_SERVICES)
        logger.info("Default services initialized")
    
    # Initialize portfolio if empty
    portfolio_count = await db.portfolio.count_documents({})
    if portfolio_count == 0:
        await db.portfolio.insert_many(DEFAULT_PORTFOLIO)
        logger.info("Default portfolio initialized")
    
    # Initialize skills if empty
    skills_count = await db.skills.count_documents({})
    if skills_count == 0:
        await db.skills.insert_many(DEFAULT_SKILLS)
        logger.info("Default skills initialized")

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    admin = await db.admin.find_one({"username": credentials.username})
    if not admin or admin["password"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate token
    token = secrets.token_urlsafe(32)
    active_tokens[token] = {"username": credentials.username}
    
    return {"token": token, "message": "Login successful"}

@api_router.post("/admin/logout")
async def admin_logout(user: dict = Depends(verify_token)):
    # Remove token from active tokens
    token_to_remove = None
    for token, data in active_tokens.items():
        if data["username"] == user["username"]:
            token_to_remove = token
            break
    if token_to_remove:
        del active_tokens[token_to_remove]
    return {"message": "Logged out successfully"}

@api_router.get("/admin/verify")
async def verify_admin(user: dict = Depends(verify_token)):
    return {"valid": True, "username": user["username"]}

@api_router.put("/admin/credentials")
async def update_admin_credentials(update: AdminCredentialsUpdate, user: dict = Depends(verify_token)):
    admin = await db.admin.find_one({"username": user["username"]})
    if not admin or admin["password"] != hash_password(update.current_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    update_data = {}
    if update.new_username:
        update_data["username"] = update.new_username
    if update.new_password:
        update_data["password"] = hash_password(update.new_password)
    
    if update_data:
        await db.admin.update_one({"username": user["username"]}, {"$set": update_data})
        # Update active token username if changed
        if update.new_username:
            for token, data in active_tokens.items():
                if data["username"] == user["username"]:
                    active_tokens[token]["username"] = update.new_username
    
    return {"message": "Credentials updated successfully"}

# ----- Section Visibility Management -----

@api_router.get("/admin/section-visibility")
async def admin_get_section_visibility(user: dict = Depends(verify_token)):
    visibility = await db.section_visibility.find_one({}, {"_id": 0})
    if not visibility:
        return DEFAULT_SECTION_VISIBILITY
    return visibility

@api_router.put("/admin/section-visibility")
async def admin_update_section_visibility(update: SectionVisibilityUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    existing = await db.section_visibility.find_one({})
    if existing:
        await db.section_visibility.update_one({}, {"$set": update_data})
    else:
        new_visibility = {**DEFAULT_SECTION_VISIBILITY, **update_data}
        await db.section_visibility.insert_one(new_visibility)
    
    return {"message": "Section visibility updated successfully"}

# ----- Admin Content Management -----

@api_router.get("/admin/content")
async def admin_get_site_content(user: dict = Depends(verify_token)):
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        return DEFAULT_CONTENT
    return content

@api_router.put("/admin/content")
async def admin_update_site_content(update: SiteContentUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    await db.site_content.update_one({}, {"$set": update_data}, upsert=True)
    return {"message": "Content updated successfully"}

# ----- Admin Portfolio Management -----

@api_router.get("/admin/portfolio")
async def admin_get_portfolio(user: dict = Depends(verify_token)):
    projects = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return projects

@api_router.post("/admin/portfolio")
async def admin_create_portfolio(project: PortfolioProjectCreate, user: dict = Depends(verify_token)):
    portfolio_project = PortfolioProject(**project.model_dump())
    doc = portfolio_project.model_dump()
    await db.portfolio.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Project created", "project": doc}

@api_router.put("/admin/portfolio/{project_id}")
async def admin_update_portfolio(project_id: str, update: PortfolioProjectUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.portfolio.update_one({"id": project_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project updated"}

@api_router.delete("/admin/portfolio/{project_id}")
async def admin_delete_portfolio(project_id: str, user: dict = Depends(verify_token)):
    result = await db.portfolio.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# ----- Admin Services Management -----

@api_router.get("/admin/services")
async def admin_get_services(user: dict = Depends(verify_token)):
    services = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return services

@api_router.post("/admin/services")
async def admin_create_service(service: ServiceCreate, user: dict = Depends(verify_token)):
    service_obj = Service(**service.model_dump())
    doc = service_obj.model_dump()
    await db.services.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Service created", "service": doc}

@api_router.put("/admin/services/{service_id}")
async def admin_update_service(service_id: str, update: ServiceUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.services.update_one({"id": service_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {"message": "Service updated"}

@api_router.delete("/admin/services/{service_id}")
async def admin_delete_service(service_id: str, user: dict = Depends(verify_token)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}

# ----- Admin Testimonials Management -----

@api_router.get("/admin/testimonials")
async def admin_get_testimonials(user: dict = Depends(verify_token)):
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return testimonials

@api_router.post("/admin/testimonials")
async def admin_create_testimonial(testimonial: TestimonialCreate, user: dict = Depends(verify_token)):
    testimonial_obj = Testimonial(**testimonial.model_dump())
    doc = testimonial_obj.model_dump()
    await db.testimonials.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Testimonial created", "testimonial": doc}

@api_router.put("/admin/testimonials/{testimonial_id}")
async def admin_update_testimonial(testimonial_id: str, update: TestimonialUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    return {"message": "Testimonial updated"}

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def admin_delete_testimonial(testimonial_id: str, user: dict = Depends(verify_token)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted"}

# ----- Admin Skills Management -----

@api_router.get("/admin/skills")
async def admin_get_skills(user: dict = Depends(verify_token)):
    skills = await db.skills.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return skills

@api_router.post("/admin/skills")
async def admin_create_skill(skill: SkillCreate, user: dict = Depends(verify_token)):
    skill_obj = Skill(**skill.model_dump())
    doc = skill_obj.model_dump()
    await db.skills.insert_one(doc)
    doc.pop("_id", None)
    return {"message": "Skill created", "skill": doc}

@api_router.put("/admin/skills/{skill_id}")
async def admin_update_skill(skill_id: str, update: SkillUpdate, user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.skills.update_one({"id": skill_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill updated"}

@api_router.delete("/admin/skills/{skill_id}")
async def admin_delete_skill(skill_id: str, user: dict = Depends(verify_token)):
    result = await db.skills.delete_one({"id": skill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted"}

# ----- Admin Contact Messages -----

@api_router.get("/admin/messages")
async def admin_get_messages(user: dict = Depends(verify_token)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages

@api_router.delete("/admin/messages/{message_id}")
async def admin_delete_message(message_id: str, user: dict = Depends(verify_token)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted"}

# ----- File Upload -----

@api_router.post("/admin/upload")
async def admin_upload_file(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG, WebP, GIF")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = UPLOADS_DIR / filename
    
    # Save file
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the URL path
    return {"url": f"/api/uploads/{filename}", "filename": filename}

# ----- Dashboard Stats -----

@api_router.get("/admin/stats")
async def admin_get_stats(user: dict = Depends(verify_token)):
    portfolio_count = await db.portfolio.count_documents({})
    services_count = await db.services.count_documents({})
    testimonials_count = await db.testimonials.count_documents({})
    messages_count = await db.contact_messages.count_documents({})
    skills_count = await db.skills.count_documents({})
    
    return {
        "portfolio": portfolio_count,
        "services": services_count,
        "testimonials": testimonials_count,
        "messages": messages_count,
        "skills": skills_count
    }

# ----- Excel Tool Endpoints -----

# Store uploaded Excel data temporarily (in production, use Redis or database)
excel_sessions = {}

class ColumnMapping(BaseModel):
    business_name: Optional[List[str]] = None
    website: Optional[List[str]] = None
    phone: Optional[List[str]] = None
    email: Optional[List[str]] = None
    address: Optional[List[str]] = None  # Can be multiple columns to merge
    opening_hours: Optional[List[str]] = None

class ProcessExcelRequest(BaseModel):
    session_id: str
    column_mapping: ColumnMapping

@api_router.post("/excel/upload")
async def upload_excel_files(
    file1: UploadFile = File(...),
    file2: Optional[UploadFile] = File(None)
):
    """Upload one or two Excel/CSV files and get column headers"""
    try:
        session_id = str(uuid.uuid4())
        
        def read_file(content, filename):
            """Read file based on extension, trying multiple formats"""
            file_ext = filename.lower().split('.')[-1] if '.' in filename else ''
            
            # Try CSV first if extension matches
            if file_ext == 'csv':
                try:
                    return pd.read_csv(io.BytesIO(content))
                except:
                    pass
            
            # Try xlsx (openpyxl)
            try:
                return pd.read_excel(io.BytesIO(content), engine='openpyxl')
            except:
                pass
            
            # Try xls (xlrd)
            try:
                return pd.read_excel(io.BytesIO(content), engine='xlrd')
            except:
                pass
            
            # Try CSV as fallback (some files are CSV with wrong extension)
            try:
                return pd.read_csv(io.BytesIO(content))
            except:
                pass
            
            # Try with auto-detection
            try:
                return pd.read_excel(io.BytesIO(content))
            except Exception as e:
                raise ValueError(f"Could not read file '{filename}'. Supported formats: .xlsx, .xls, .csv. Error: {str(e)}")
        
        # Read first file
        content1 = await file1.read()
        df1 = read_file(content1, file1.filename)
        
        # Read second file if provided
        df2 = None
        if file2:
            content2 = await file2.read()
            df2 = read_file(content2, file2.filename)
        
        # Store dataframes in session
        excel_sessions[session_id] = {
            "df1": df1,
            "df2": df2,
            "created_at": datetime.now(timezone.utc)
        }
        
        # Get column headers from both files
        columns1 = df1.columns.tolist()
        columns2 = df2.columns.tolist() if df2 is not None else []
        
        return {
            "session_id": session_id,
            "file1_columns": columns1,
            "file2_columns": columns2,
            "file1_rows": len(df1),
            "file2_rows": len(df2) if df2 is not None else 0
        }
    except Exception as e:
        logger.error(f"Excel upload error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

@api_router.post("/excel/process")
async def process_excel_files(request: ProcessExcelRequest):
    """Process and merge Excel files based on column mapping"""
    try:
        session_id = request.session_id
        mapping = request.column_mapping
        
        if session_id not in excel_sessions:
            raise HTTPException(status_code=404, detail="Session not found. Please upload files again.")
        
        session = excel_sessions[session_id]
        df1 = session["df1"]
        df2 = session["df2"]
        
        # Function to extract and combine columns
        def extract_columns(df, column_list, combine=False):
            if not column_list:
                return None
            existing_cols = [c for c in column_list if c in df.columns]
            if not existing_cols:
                return None
            if combine:
                # Combine multiple columns (for addresses)
                return df[existing_cols].apply(
                    lambda row: ', '.join([str(v) for v in row if pd.notna(v) and str(v).strip()]), 
                    axis=1
                )
            else:
                # Take first non-null value from specified columns
                return df[existing_cols].bfill(axis=1).iloc[:, 0]
        
        # Process each dataframe
        processed_dfs = []
        
        for df in [df1, df2]:
            if df is None:
                continue
                
            processed = pd.DataFrame()
            
            # Extract each field
            if mapping.business_name:
                val = extract_columns(df, mapping.business_name)
                if val is not None:
                    processed['Business Name'] = val
            
            if mapping.website:
                val = extract_columns(df, mapping.website)
                if val is not None:
                    processed['Website'] = val
            
            if mapping.phone:
                val = extract_columns(df, mapping.phone)
                if val is not None:
                    processed['Phone'] = val
            
            if mapping.email:
                val = extract_columns(df, mapping.email)
                if val is not None:
                    processed['Email'] = val
            
            if mapping.address:
                val = extract_columns(df, mapping.address, combine=True)
                if val is not None:
                    processed['Address'] = val
            
            if mapping.opening_hours:
                val = extract_columns(df, mapping.opening_hours)
                if val is not None:
                    processed['Opening Hours'] = val
            
            if not processed.empty:
                processed_dfs.append(processed)
        
        if not processed_dfs:
            raise HTTPException(status_code=400, detail="No data could be extracted with the provided mapping")
        
        # Merge dataframes
        merged_df = pd.concat(processed_dfs, ignore_index=True)
        
        # Clean phone numbers for comparison (remove non-digits)
        def clean_phone(phone):
            if pd.isna(phone):
                return None
            return ''.join(filter(str.isdigit, str(phone)))
        
        # Clean email for comparison (lowercase, strip)
        def clean_email(email):
            if pd.isna(email):
                return None
            return str(email).lower().strip()
        
        # Remove duplicates based on phone OR email
        merged_df['_clean_phone'] = merged_df['Phone'].apply(clean_phone) if 'Phone' in merged_df.columns else None
        merged_df['_clean_email'] = merged_df['Email'].apply(clean_email) if 'Email' in merged_df.columns else None
        
        # Create a composite key for deduplication
        def get_dedup_key(row):
            keys = []
            if pd.notna(row.get('_clean_phone')) and row.get('_clean_phone'):
                keys.append(f"phone:{row['_clean_phone']}")
            if pd.notna(row.get('_clean_email')) and row.get('_clean_email'):
                keys.append(f"email:{row['_clean_email']}")
            return tuple(keys) if keys else (f"row:{uuid.uuid4()}",)
        
        # Track seen keys and remove duplicates
        seen_keys = set()
        rows_to_keep = []
        
        for idx, row in merged_df.iterrows():
            dedup_keys = get_dedup_key(row)
            is_duplicate = False
            for key in dedup_keys:
                if key in seen_keys:
                    is_duplicate = True
                    break
            if not is_duplicate:
                rows_to_keep.append(idx)
                for key in dedup_keys:
                    seen_keys.add(key)
        
        # Keep only non-duplicate rows
        final_df = merged_df.loc[rows_to_keep].copy()
        
        # Remove helper columns
        final_df = final_df.drop(columns=['_clean_phone', '_clean_email'], errors='ignore')
        
        # Add Contacted checkbox column
        final_df.insert(0, 'Contacted', False)
        
        # Add unique ID for frontend
        final_df.insert(0, 'ID', [str(uuid.uuid4()) for _ in range(len(final_df))])
        
        # Store processed data
        excel_sessions[session_id]["processed_df"] = final_df
        
        # Convert to records for JSON response
        # Replace NaN/Infinity with None for JSON compatibility
        final_df_clean = final_df.replace([float('inf'), float('-inf')], None)
        final_df_clean = final_df_clean.where(pd.notna(final_df_clean), None)
        records = final_df_clean.to_dict(orient='records')
        
        # Clean up any remaining NaN values in records
        for record in records:
            for key, value in record.items():
                if pd.isna(value) or (isinstance(value, float) and (value != value)):  # NaN check
                    record[key] = None
        
        # Stats
        original_count = len(df1) + (len(df2) if df2 is not None else 0)
        final_count = len(final_df)
        duplicates_removed = original_count - final_count
        
        return {
            "success": True,
            "data": records,
            "stats": {
                "original_count": original_count,
                "final_count": final_count,
                "duplicates_removed": duplicates_removed
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Excel processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing Excel files: {str(e)}")

@api_router.post("/excel/update-contacted")
async def update_contacted_status(session_id: str = Form(...), contacted_ids: str = Form(...)):
    """Update contacted status for specific rows"""
    try:
        if session_id not in excel_sessions or "processed_df" not in excel_sessions[session_id]:
            raise HTTPException(status_code=404, detail="Session not found")
        
        ids_list = json.loads(contacted_ids)
        df = excel_sessions[session_id]["processed_df"]
        df.loc[df['ID'].isin(ids_list), 'Contacted'] = True
        df.loc[~df['ID'].isin(ids_list), 'Contacted'] = False
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/excel/download/{session_id}")
async def download_excel(session_id: str):
    """Download the processed Excel file"""
    try:
        if session_id not in excel_sessions or "processed_df" not in excel_sessions[session_id]:
            raise HTTPException(status_code=404, detail="Session not found. Please process files again.")
        
        df = excel_sessions[session_id]["processed_df"]
        
        # Create Excel file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Convert boolean to Yes/No for Excel
            df_export = df.copy()
            df_export['Contacted'] = df_export['Contacted'].apply(lambda x: 'Yes' if x else 'No')
            df_export = df_export.drop(columns=['ID'], errors='ignore')
            df_export.to_excel(writer, index=False, sheet_name='Cleaned Data')
        
        output.seek(0)
        
        # Generate filename with timestamp
        filename = f"cleaned_leads_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Excel download error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating Excel file: {str(e)}")

# Include the router and mount uploads
app.include_router(api_router)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
