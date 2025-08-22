from sqlalchemy.orm import Session
from models import Brand, Holder, BrandStatus
from schemas import BrandCreate, BrandUpdate, HolderCreate, StatusCreate

# --- Brands ---
def list_brands(db: Session):
    return db.query(Brand).order_by(Brand.id.desc()).all()

def get_brand(db: Session, brand_id: int):
    return db.query(Brand).filter(Brand.id == brand_id).first()

def create_brand(db: Session, data: BrandCreate):
    brand = Brand(**data.model_dump())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand

def update_brand(db: Session, brand: Brand, data: BrandUpdate):
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(brand, k, v)
    db.commit()
    db.refresh(brand)
    return brand

def delete_brand(db: Session, brand: Brand):
    db.delete(brand)
    db.commit()

# --- Holders ---
def create_holder(db: Session, data: HolderCreate):
    holder = Holder(**data.model_dump())
    db.add(holder)
    db.commit()
    db.refresh(holder)
    return holder

def list_holders(db: Session):
    return db.query(Holder).order_by(Holder.name.asc()).all()

# --- Statuses ---
def seed_statuses(db: Session):
    defaults = [("PENDING","Pendiente"),("ACTIVE","Activa"),("INACTIVE","Inactiva")]
    for code, label in defaults:
        if not db.query(BrandStatus).filter_by(code=code).first():
            db.add(BrandStatus(code=code, label=label))
    db.commit()

def create_status(db: Session, data: StatusCreate):
    status = BrandStatus(**data.model_dump())
    db.add(status)
    db.commit()
    db.refresh(status)
    return status

def list_statuses(db: Session):
    return db.query(BrandStatus).order_by(BrandStatus.id.asc()).all()
