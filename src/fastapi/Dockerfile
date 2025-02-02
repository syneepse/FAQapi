FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/app/fastapi

ARG UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

RUN pip install fastapi

USER appuser

RUN ls

# WORKDIR /app
# COPY ./ ./

COPY . /usr/app/fastapi
COPY ./main.py /usr/app/fastapi

EXPOSE 8000

CMD fastapi run main.py