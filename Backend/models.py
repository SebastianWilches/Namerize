from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class BrandStatus(Base):
    __tablename__ = "brand_statuses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)   # e.g. ACTIVE
    label: Mapped[str] = mapped_column(String(60), nullable=False)

    # Soft delete + timestamps
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Holder(Base):
    __tablename__ = "holders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    legal_identifier: Mapped[str | None] = mapped_column(String(50))
    email: Mapped[str | None] = mapped_column(String(150))

    # Soft delete + timestamps
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    brands = relationship("Brand", back_populates="holder")

class Brand(Base):
    __tablename__ = "brands"
    __table_args__ = (UniqueConstraint("name", "holder_id", name="uq_brands_name_holder"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    holder_id: Mapped[int] = mapped_column(ForeignKey("holders.id"), nullable=False)
    status_id: Mapped[int] = mapped_column(ForeignKey("brand_statuses.id"), nullable=False)

    # Soft delete + timestamps
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    holder = relationship("Holder", back_populates="brands")
    status = relationship("BrandStatus")
