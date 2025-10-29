from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

try:
    # Load environment variables from .env if present
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass


def create_app() -> FastAPI:
    app = FastAPI(title="FarmMatch API", version="0.1.0")

    # CORS (allow local dev Frontend by default)
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin, "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def read_root():
        return {"message": "FarmMatch API is running"}

    @app.get("/health")
    def health_check():
        return {"status": "ok"}

    return app


app = create_app()
