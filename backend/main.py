import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Text, select
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

# DB接続情報（docker-composeで設定した環境変数を使用）
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemyの非同期設定
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

app = FastAPI(title="重機レンタル予約API")

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rental.go-pro-world.net"], # フロントエンドのドメイン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースモデル定義（例：重機マスター）
class Machine(Base):
    __tablename__ = "machines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    model_number = Column(String(50)) # 型式
    description = Column(Text)

# DBセッションの依存注入用
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# アプリ起動時にテーブルを作成（簡易的な方法）
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# --- エンドポイント ---

@app.get("/")
def read_root():
    return {"message": "Heavy Machine Rental API is running"}

@app.get("/machines")
async def get_machines(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Machine))
    machines = result.scalars().all()
    return machines

@app.post("/machines")
async def create_machine(name: str, model: str, db: AsyncSession = Depends(get_db)):
    new_machine = Machine(name=name, model_number=model)
    db.add(new_machine)
    await db.commit()
    await db.refresh(new_machine)
    return new_machine
