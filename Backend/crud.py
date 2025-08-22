from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy import or_
from models import Brand, Holder, BrandStatus
from schemas import BrandCreate, BrandUpdate, HolderCreate, StatusCreate

# --- Brands ---
def list_brands(
    db: Session,
    include_inactive: bool = False,
    search: str | None = None,
    page: int = 1,
    page_size: int = 10,
):
    q = db.query(Brand)
    if not include_inactive:
        q = q.filter(Brand.is_active.is_(True))

    if search:
        like = f"%{search}%"
        q = q.filter(
            or_(
                Brand.name.ilike(like),
                Brand.description.ilike(like)
            )
        )

    total = q.count()
    items = (
        q.order_by(Brand.id.desc())
         .offset((page - 1) * page_size)
         .limit(page_size)
         .all()
    )
    return items, total

def get_brand(db: Session, brand_id: int, include_inactive: bool = False):
    q = db.query(Brand).filter(Brand.id == brand_id)
    if not include_inactive:
        q = q.filter(Brand.is_active.is_(True))
    return q.first()

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

def soft_delete_brand(db: Session, brand: Brand):
    brand.is_active = False
    db.commit()
    return

# --- Holders ---
def list_holders(
    db: Session,
    include_inactive: bool = False,
    search: str | None = None,
    page: int = 1,
    page_size: int = 10,
):
    q = db.query(Holder)
    if not include_inactive:
        q = q.filter(Holder.is_active.is_(True))

    if search:
        like = f"%{search}%"
        q = q.filter(
            or_(
                Holder.name.ilike(like),
                Holder.legal_identifier.ilike(like),
                Holder.email.ilike(like),
            )
        )

    total = q.count()
    items = (
        q.order_by(Holder.name.asc())
         .offset((page - 1) * page_size)
         .limit(page_size)
         .all()
    )
    return items, total

def get_holder(db: Session, holder_id: int, include_inactive: bool = False):
    q = db.query(Holder).filter(Holder.id == holder_id)
    if not include_inactive:
        q = q.filter(Holder.is_active.is_(True))
    return q.first()

def create_holder(db: Session, data: HolderCreate):
    holder = Holder(**data.model_dump())
    db.add(holder)
    db.commit()
    db.refresh(holder)
    return holder

def soft_delete_holder(db: Session, holder: Holder):
    holder.is_active = False
    db.commit()
    return

# --- Statuses ---
def list_statuses(db: Session, include_inactive: bool = False):
    q = db.query(BrandStatus).order_by(BrandStatus.id.asc())
    if not include_inactive:
        q = q.filter(BrandStatus.is_active.is_(True))
    return q.all()

def get_status(db: Session, status_id: int, include_inactive: bool = False):
    q = db.query(BrandStatus).filter(BrandStatus.id == status_id)
    if not include_inactive:
        q = q.filter(BrandStatus.is_active.is_(True))
    return q.first()

def create_status(db: Session, data: StatusCreate):
    status = BrandStatus(**data.model_dump())
    db.add(status)
    db.commit()
    db.refresh(status)
    return status

def soft_delete_status(db: Session, status: BrandStatus):
    status.is_active = False
    db.commit()
    return

def seed_statuses(db: Session):
    defaults = [("PENDING","Pendiente"),("ACTIVE","Activa"),("INACTIVE","Inactiva")]
    for code, label in defaults:
        if not db.query(BrandStatus).filter_by(code=code).first():
            db.add(BrandStatus(code=code, label=label))
    db.commit()
