from typing import Literal, TypedDict

class TwitchToken(TypedDict):
    access_token: str
    expires_in: int # seconds
    token_type: Literal["bearer"]