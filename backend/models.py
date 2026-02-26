from pydantic import BaseModel

class ModuleRequest(BaseModel):
    module_id: str