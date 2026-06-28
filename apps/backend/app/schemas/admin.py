from pydantic import BaseModel, ConfigDict, Field


class AdminLoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class AdminSessionResponse(BaseModel):
    authenticated: bool
    email: str | None = None


class MessageResponse(BaseModel):
    message: str


class AuthenticatedAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
