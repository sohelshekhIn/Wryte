from fastapi import FastAPI

from app.core.database import engine, Base 
# engine is the connection bridge to the database, Base is the base class for all models (SQLAlchemy registry for all models)
from app.models import Book
# Book is not used directly in this file, but we import it to ensure that the model is registered with SQLAlchemy's metadata. 
# This is necessary for table creation and migrations.
from app.routes.books import router as books_router
#this loads the router for the books endpoints, which we will register with the FastAPI app below.

app = FastAPI(
    title="Wryte DB Demo",
    description="Mini backend for testing SQLAlchemy + FastAPI",
    version="1.0.0"
)

# Register API routes
app.include_router(books_router)

# TEMP: auto-create tables (development only)
# We will replace this with Alembic migrations later.

Base.metadata.create_all(bind=engine)
#metabase stores the database blueprint, which is used to create the tables in the database. 
# The create_all method creates all tables that are defined in the metadata of the Base class. 
# The bind parameter specifies the engine to use for the connection to the database.
# all info of the classes that inherit from Base will be stored in the metadata, 
# and when we call create_all, it will create the corresponding tables in the database.


@app.get("/")
def root():
    return {"message": "Wryte DB API is running"}