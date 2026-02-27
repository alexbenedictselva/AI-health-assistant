import numpy as np
from typing import Any


def convert_to_native_python(obj: Any) -> Any:
    """
    Recursively convert numpy types and other non-serializable types to native Python types.
    Safe for JSON serialization.
    """
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_to_native_python(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_to_native_python(item) for item in obj]
    return obj
