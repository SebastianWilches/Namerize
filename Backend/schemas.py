from datetime import datetime
from pydantic import BaseModel, Field

# Holders
class HolderBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    tax_id: str | None = None
    email: str | None = None

class HolderCreate(HolderBase): pass
class HolderOut(HolderBase):
    id: int
    class Config: from_attributes = True

# Statuses
class StatusBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=30)
    label: str = Field(..., min_length=2, max_length=60)

class StatusCreate(StatusBase): pass
class StatusOut(StatusBase):
    id: int
    class Config: from_attributes = True

# Brands
class BrandBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    holder_id: int
    status_id: int

class BrandCreate(BrandBase): pass

class BrandUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    holder_id: int | None = None
    status_id: int | None = None

class BrandOut(BaseModel):
    id: int
    name: str
    description: str | None
    holder_id: int
    status_id: int
    created_at: datetime
    updated_at: datetime
    class Config: from_attributes = True
