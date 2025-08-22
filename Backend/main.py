import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
def list_brands(db: Session = Depends(get_db)):
    return crud.list_brands(db)

@app.post("/brands", response_model=BrandOut, status_code=201)
def create_brand(payload: BrandCreate, db: Session = Depends(get_db)):
    return crud.create_brand(db, payload)

@app.get("/brands/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = crud.get_brand(db, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@app.put("/brands/{brand_id}", response_model=BrandOut)
def update_brand(brand_id: int, payload: BrandUpdate, db: Session = Depends(get_db)):
    brand = crud.get_brand(db, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if payload.name == "":
        raise HTTPException(status_code=400, detail="'name' cannot be empty")
    return crud.update_brand(db, brand, payload)

@app.delete("/brands/{brand_id}", status_code=204)
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = crud.get_brand(db, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    crud.delete_brand(db, brand)
    return

# --- Holders ---
@app.post("/holders", response_model=HolderOut, status_code=201)
def create_holder(payload: HolderCreate, db: Session = Depends(get_db)):
    return crud.create_holder(db, payload)

@app.get("/holders", response_model=list[HolderOut])
def list_holders(db: Session = Depends(get_db)):
    return crud.list_holders(db)

# --- Statuses ---
@app.post("/statuses", response_model=StatusOut, status_code=201)
def create_status(payload: StatusCreate, db: Session = Depends(get_db)):
    return crud.create_status(db, payload)

@app.get("/statuses", response_model=list[StatusOut])
def list_statuses(db: Session = Depends(get_db)):
    return crud.list_statuses(db)
