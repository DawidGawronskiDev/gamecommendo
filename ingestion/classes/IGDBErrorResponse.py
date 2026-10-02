from typing import TypedDict


class IGDBErrorResponse(TypedDict):
    status: int
    message: str