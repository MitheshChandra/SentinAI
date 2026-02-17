# -- Base Stage --
FROM python:3.11-slim as builder

WORKDIR /app

# Install dependencies
# We use --no-cache-dir to keep the image small
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -- Runtime Stage --
# In a real secure env, we might use a 'distroless' image here
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder (if we used venv)
# For simplicity in Phase 1, we just installed globally in slim, 
# so we can just copy the code.
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .

# Expose the port
EXPOSE 8000

# CMD to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
