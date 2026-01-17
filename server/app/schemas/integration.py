from pydantic import BaseModel

class IntegrationRequest(BaseModel):
    service: str
    apiKey: str
