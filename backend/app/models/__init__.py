from .Book import Book

# This file is intentionally left empty to make the "models" directory a package.

# Benefits explained:

# without __init__.py, you cannot import models as a package. 

# Without this file you'll have to do this:
# from app.models.Book import Book
# You must import each model individually everywhere.

# Solution
# with models/__init__.py

# from app.models import Book
# works cleanly.