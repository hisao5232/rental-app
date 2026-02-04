import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Text, select, Boolean
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

app = FastAPI(title="重機レンタル予約API")

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
    name = Column(String(100), nullable=False)      # 通称（例：ユンボ）
    model_number = Column(String(50))              # 型式（例：PC30UU）
    serial_number = Column(String(50))             # 機番
    maker = Column(String(50))                     # メーカー
    performance = Column(Text)                     # 性能（例：0.11m3）
    attachment_type = Column(String(100))          # アタッチメント

    # 仕様（Boolean値）
    has_crane = Column(Boolean, default=False)           # クレーン仕様
    has_service_port = Column(Boolean, default=False)    # サービスポート付き
    is_ultra_small_swing = Column(Boolean, default=False) # 超小旋回
    is_rear_small_swing = Column(Boolean, default=False)  # 後方小旋回
    
    description = Column(Text)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    role = Column(String(20), default="customer") # "admin" or "customer"
    full_name = Column(String(100))

# --- DB操作 ---

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def create_seed_data(db_session: AsyncSession):
    # 管理者の作成
    result = await db_session.execute(select(User).filter(User.email == "admin@example.com"))
    if not result.scalars().first():
        admin = User(
            email="admin@example.com",
            hashed_password="password123",
            role="admin",
            full_name="管理者ヒサオ"
        )
        db_session.add(admin)

    # カスタマーの作成
    result = await db_session.execute(select(User).filter(User.email == "user@example.com"))
    if not result.scalars().first():
        customer = User(
            email="user@example.com",
            hashed_password="password123",
            role="customer",
            full_name="テスト顧客"
        )
        db_session.add(customer)
    
    await db_session.commit()

@app.on_event("startup")
async def on_startup():
    # テーブル作成
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 初期データ投入
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
async def create_machine(name: str, model: str, db: AsyncSession = Depends(get_db)):
    new_machine = Machine(name=name, model_number=model)
    db.add(new_machine)
    await db.commit()
    await db.refresh(new_machine)
    return new_machine
