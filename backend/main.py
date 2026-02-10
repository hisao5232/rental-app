import os
import datetime  # 追加
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Text, select, Boolean, DateTime # DateTime追加
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

app = FastAPI(title="重機レンタル予約 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rental.go-pro-world.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- モデル定義 ---

class Machine(Base):
    __tablename__ = "machines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    model_number = Column(String(50))
    serial_number = Column(String(50))
    maker = Column(String(50))
    performance = Column(Text)
    attachment_type = Column(String(100))
    has_crane = Column(Boolean, default=False)
    has_service_port = Column(Boolean, default=False)
    is_ultra_small_swing = Column(Boolean, default=False)
    is_rear_small_swing = Column(Boolean, default=False)
    status = Column(String(20), default="在庫あり")
    daily_rate = Column(Integer, default=0)
    monthly_rate = Column(Integer, default=0)
    description = Column(Text)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    role = Column(String(20), default="customer")
    full_name = Column(String(100))

# --- 追加：予約情報モデル ---
class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50))      # バックホーなど
    start_date = Column(String(50))    # 使用開始日
    return_date = Column(String(50))   # 返却予定日
    rate_type = Column(String(20))     # 日極 / 月極
    performance = Column(String(100))  # 希望スペック
    maker = Column(String(50))         # 希望メーカー
    attachment = Column(String(100))   # 希望アタッチメント
    options = Column(Text)             # JSON形式の文字列などで保存
    message = Column(Text)             # 備考
    created_at = Column(DateTime, default=datetime.datetime.now)

# --- DB操作 ---
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def create_seed_data(db_session: AsyncSession):
    result = await db_session.execute(select(User).filter(User.email == "admin@example.com"))
    if not result.scalars().first():
        admin = User(
            email="admin@example.com",
            hashed_password="password123",
            role="admin",
            full_name="管理者ヒサオ"
        )
        db_session.add(admin)
    await db_session.commit()

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await create_seed_data(session)

# --- エンドポイント ---

@app.get("/")
def read_root():
    return {"message": "Heavy Machine Rental API is running"}

@app.get("/machines")
async def get_machines(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine))
    return result.scalars().all()

@app.post("/machines")
async def create_machine(machine_data: dict, db: AsyncSession = Depends(get_db)):
    new_machine = Machine(**machine_data) # まとめて展開して作成
    db.add(new_machine)
    await db.commit()
    await db.refresh(new_machine)
    return new_machine

@app.put("/machines/{machine_id}")
async def update_machine(machine_id: int, machine_data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine).where(Machine.id == machine_id))
    db_machine = result.scalar_one_or_none()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    for key, value in machine_data.items():
        if hasattr(db_machine, key):
            setattr(db_machine, key, value)
    await db.commit()
    await db.refresh(db_machine)
    return db_machine

@app.delete("/machines/{machine_id}")
async def delete_machine(machine_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine).where(Machine.id == machine_id))
    db_machine = result.scalar_one_or_none()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    await db.delete(db_machine)
    await db.commit()
    return {"message": "Successfully deleted"}

# --- 追加：予約問い合わせを受け付ける ---
@app.post("/reservations")
async def create_reservation(res_data: dict, db: AsyncSession = Depends(get_db)):
    new_res = Reservation(
        category=res_data.get("category"),
        start_date=res_data.get("startDate"),
        return_date=res_data.get("returnDate"),
        rate_type=res_data.get("rateType"),
        performance=res_data.get("performance"),
        maker=res_data.get("maker"),
        attachment=res_data.get("attachment"),
        options=str(res_data.get("options")), # dictを文字列にして保存
        message=res_data.get("message")
    )
    db.add(new_res)
    await db.commit()
    await db.refresh(new_res)
    return {"status": "success", "id": new_res.id}

# --- 追加：管理者が予約一覧を確認する ---
@app.get("/reservations")
async def get_reservations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reservation).order_by(Reservation.created_at.desc()))
    return result.scalars().all()
