from fastapi import FastAPI
from user.routes import user_router
from fastapi.middleware.cors import CORSMiddleware

from config import Config

version = "v1"

description = """
A REST API for a book review web service.

This REST API is able to;
- Create Read Update And delete books
- Add reviews to books
- Add tags to Books e.t.c.
    """

version_prefix =f"/api/{version}"

app = FastAPI(
    title="MMORPG",
    description=description,
    version=version,
    contact={
        "name": "Radmir Galiullin",
        "url": "https://github.com/s0ull877",
        "email": "ssalijonathank@gmail.com",
    },
    terms_of_service="httpS://example.com/tos",
    openapi_url=f"{version_prefix}/openapi.json",
    docs_url=f"{version_prefix}/docs",
    redoc_url=f"{version_prefix}/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.TRUSTED_ORIGINS,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(user_router, prefix=f"{version_prefix}/user", tags=["user"])