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
    status = Column(String(20), default="在庫あり") # 稼働中、在庫あり、点検中 など
    daily_rate = Column(Integer, default=0)      # 日極料金
    monthly_rate = Column(Integer, default=0)    # 月極料金
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
async def create_machine(
    machine_data: dict,  # JSONでまとめて受け取る
    db: AsyncSession = Depends(get_db)
):
    new_machine = Machine(
        name=machine_data.get("name"),
        model_number=machine_data.get("model_number"),
        serial_number=machine_data.get("serial_number"),
        maker=machine_data.get("maker"),
        performance=machine_data.get("performance"),
        attachment_type=machine_data.get("attachment_type"),
        has_crane=machine_data.get("has_crane", False),
        has_service_port=machine_data.get("has_service_port", False),
        is_ultra_small_swing=machine_data.get("is_ultra_small_swing", False),
        is_rear_small_swing=machine_data.get("is_rear_small_swing", False),
        status=machine_data.get("status", "在庫あり"),
        daily_rate=int(machine_data.get("daily_rate", 0)),
        monthly_rate=int(machine_data.get("monthly_rate", 0)),
    )
    db.add(new_machine)
    await db.commit()
    await db.refresh(new_machine)
    return new_machine

# --- 指定したIDの重機情報を更新する ---
@app.put("/machines/{machine_id}")
async def update_machine(machine_id: int, machine_data: dict, db: AsyncSession = Depends(get_db)):
    # 1. データベースから対象の重機を探す
    result = await db.execute(select(Machine).where(Machine.id == machine_id))
    db_machine = result.scalar_one_or_none()
    
    # 2. もし見つからなかったらエラーを返す
    if not db_machine:
        return {"error": "Machine not found"}

    # 3. 送られてきたデータ（machine_data）で既存のデータを上書きする
    # キー（名前、型式など）を一つずつチェックして更新
    for key, value in machine_data.items():
        if hasattr(db_machine, key):
            setattr(db_machine, key, value)

    # 4. 変更を確定（コミット）
    await db.commit()
    await db.refresh(db_machine)
    
    return db_machine
