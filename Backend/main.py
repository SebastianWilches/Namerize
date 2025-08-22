import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from schemas import (
    BrandCreate, BrandUpdate, BrandOut, PaginatedBrands,
    HolderCreate, HolderOut, PaginatedHolders,
    StatusCreate, StatusOut
)
import crud

app = FastAPI(title="Namerize Brand API", version="1.0.0")

# CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Seed inicial de estados
@app.on_event("startup")
def on_startup():
    with next(get_db()) as db:
        crud.seed_statuses(db)

@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------
#         BRANDS
# ---------------------------

@app.get("/brands", response_model=PaginatedBrands)
def list_brands(
    include_inactive: bool = Query(False),
    search: str | None = Query(None, description="Buscar por nombre/descripcion"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = crud.list_brands(
        db,
        include_inactive=include_inactive,
        search=search,
        page=page,
        page_size=page_size,
    )
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total,
    }

@app.post("/brands", response_model=BrandOut, status_code=201)
def create_brand(
    payload: BrandCreate,
    db: Session = Depends(get_db)
):
    return crud.create_brand(db, payload)

@app.get("/brands/{brand_id}", response_model=BrandOut)
def get_brand(
    brand_id: int,
    include_inactive: bool = Query(False),
    db: Session = Depends(get_db)
):
    brand = crud.get_brand(db, brand_id, include_inactive=include_inactive)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@app.put("/brands/{brand_id}", response_model=BrandOut)
def update_brand(
    brand_id: int,
    payload: BrandUpdate,
    db: Session = Depends(get_db)
):
    brand = crud.get_brand(db, brand_id, include_inactive=True)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if payload.name == "":
        raise HTTPException(status_code=400, detail="'name' cannot be empty")
    return crud.update_brand(db, brand, payload)

@app.delete("/brands/{brand_id}", status_code=204)
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db)
):
    # Soft delete
    brand = crud.get_brand(db, brand_id, include_inactive=True)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    crud.soft_delete_brand(db, brand)
    return


# ---------------------------
#         HOLDERS
# ---------------------------

@app.post("/holders", response_model=HolderOut, status_code=201)
def create_holder(
    payload: HolderCreate,
    db: Session = Depends(get_db)
):
    return crud.create_holder(db, payload)

@app.get("/holders", response_model=PaginatedHolders)
def list_holders(
    include_inactive: bool = Query(False),
    search: str | None = Query(None, description="Buscar por nombre, legal_identifier o email"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = crud.list_holders(
        db,
        include_inactive=include_inactive,
        search=search,
        page=page,
        page_size=page_size,
    )
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total,
    }

@app.delete("/holders/{holder_id}", status_code=204)
def delete_holder(
    holder_id: int,
    db: Session = Depends(get_db)
):
    # Soft delete
    holder = crud.get_holder(db, holder_id, include_inactive=True)
    if not holder:
        raise HTTPException(status_code=404, detail="Holder not found")
    crud.soft_delete_holder(db, holder)
    return


# ---------------------------
#         STATUSES
# ---------------------------

@app.post("/statuses", response_model=StatusOut, status_code=201)
def create_status(
    payload: StatusCreate,
    db: Session = Depends(get_db)
):
    return crud.create_status(db, payload)

@app.get("/statuses", response_model=list[StatusOut])
def list_statuses(
    include_inactive: bool = Query(False),
    db: Session = Depends(get_db)
):
    return crud.list_statuses(db, include_inactive=include_inactive)

@app.delete("/statuses/{status_id}", status_code=204)
def delete_status(
    status_id: int,
    db: Session = Depends(get_db)
):
    # Soft delete
    status = crud.get_status(db, status_id, include_inactive=True)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    crud.soft_delete_status(db, status)
    return
