import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import Brand
from schemas import (
    BrandCreate, BrandUpdate, BrandOut,
    HolderCreate, HolderOut,
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

# --- Brands ---
@app.get("/brands", response_model=list[BrandOut])
def list_brands(include_inactive: bool = Query(False), db: Session = Depends(get_db)):
    return crud.list_brands(db, include_inactive=include_inactive)

@app.get("/brands/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: int, include_inactive: bool = Query(False), db: Session = Depends(get_db)):
    brand = crud.get_brand(db, brand_id, include_inactive=include_inactive)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@app.delete("/brands/{brand_id}", status_code=204)
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = crud.get_brand(db, brand_id, include_inactive=True)  # permitir borrar aunque esté inactiva/activa
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    crud.soft_delete_brand(db, brand)
    return

# --- Holders ---
@app.get("/holders", response_model=list[HolderOut])
def list_holders(include_inactive: bool = Query(False), db: Session = Depends(get_db)):
    return crud.list_holders(db, include_inactive=include_inactive)

@app.delete("/holders/{holder_id}", status_code=204)
def delete_holder(holder_id: int, db: Session = Depends(get_db)):
    holder = crud.get_holder(db, holder_id, include_inactive=True)
    if not holder:
        raise HTTPException(status_code=404, detail="Holder not found")
    crud.soft_delete_holder(db, holder)
    return

# --- Statuses ---
@app.get("/statuses", response_model=list[StatusOut])
def list_statuses(include_inactive: bool = Query(False), db: Session = Depends(get_db)):
    return crud.list_statuses(db, include_inactive=include_inactive)

@app.delete("/statuses/{status_id}", status_code=204)
def delete_status(status_id: int, db: Session = Depends(get_db)):
    status = crud.get_status(db, status_id, include_inactive=True)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    crud.soft_delete_status(db, status)
    return