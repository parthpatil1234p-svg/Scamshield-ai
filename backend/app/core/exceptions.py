from typing import Any, Optional


class AppException(Exception):
    def __init__(
        self,
        code: str = "INTERNAL_ERROR",
        message: str = "An unexpected error occurred.",
        status_code: int = 500,
        details: Optional[Any] = None
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Requested resource not found.", details: Optional[Any] = None):
        super().__init__(code="NOT_FOUND", message=message, status_code=404, details=details)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication credential missing or invalid.", details: Optional[Any] = None):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401, details=details)


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to access this resource.", details: Optional[Any] = None):
        super().__init__(code="FORBIDDEN", message=message, status_code=403, details=details)


class ValidationException(AppException):
    def __init__(self, message: str = "Invalid input payload.", details: Optional[Any] = None):
        super().__init__(code="UNPROCESSABLE_ENTITY", message=message, status_code=422, details=details)


class ConflictException(AppException):
    def __init__(self, message: str = "Resource already exists.", details: Optional[Any] = None):
        super().__init__(code="RESOURCE_CONFLICT", message=message, status_code=409, details=details)


class SSRFException(AppException):
    def __init__(self, message: str = "Destination URL blocked for security reasons.", details: Optional[Any] = None):
        super().__init__(code="SSRF_BLOCKED", message=message, status_code=422, details=details)
