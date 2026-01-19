"""
Appwrite Storage Service for image uploads
"""
import os
import uuid
from io import BytesIO

from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
from appwrite.id import ID


class AppwriteStorageService:
    """Service for managing file uploads to Appwrite Storage"""

    def __init__(self):
        self.client = Client()
        self.client.set_endpoint(os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1"))
        self.client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
        self.client.set_key(os.getenv("APPWRITE_API_KEY"))
        self.storage = Storage(self.client)
        self.bucket_id = os.getenv("APPWRITE_BUCKET_ID", "farm-images")

    def upload_file(self, file_content: bytes, filename: str, content_type: str) -> str:
        """
        Upload a file to Appwrite Storage

        Args:
            file_content: The file content as bytes
            filename: Original filename
            content_type: MIME type of the file

        Returns:
            The public URL of the uploaded file
        """
        # Generate unique file ID
        file_id = ID.unique()

        # Get file extension
        extension = filename.split(".")[-1] if "." in filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{extension}"

        # Create InputFile from bytes
        input_file = InputFile.from_bytes(file_content, unique_filename, content_type)

        # Upload to Appwrite
        result = self.storage.create_file(
            bucket_id=self.bucket_id,
            file_id=file_id,
            file=input_file,
        )

        # Construct the public URL
        # Format: https://cloud.appwrite.io/v1/storage/buckets/{bucket_id}/files/{file_id}/view?project={project_id}
        endpoint = os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
        project_id = os.getenv("APPWRITE_PROJECT_ID")
        file_url = f"{endpoint}/storage/buckets/{self.bucket_id}/files/{result['$id']}/view?project={project_id}"

        return file_url

    def delete_file(self, file_id: str) -> bool:
        """
        Delete a file from Appwrite Storage

        Args:
            file_id: The Appwrite file ID

        Returns:
            True if successful
        """
        try:
            self.storage.delete_file(
                bucket_id=self.bucket_id,
                file_id=file_id,
            )
            return True
        except Exception:
            return False

    def get_file_id_from_url(self, url: str) -> str | None:
        """
        Extract file ID from Appwrite URL

        Args:
            url: The Appwrite file URL

        Returns:
            The file ID or None
        """
        # URL format: .../files/{file_id}/view...
        try:
            parts = url.split("/files/")
            if len(parts) > 1:
                file_id = parts[1].split("/")[0]
                return file_id
        except Exception:
            pass
        return None


# Global instance
appwrite_storage = None


def get_appwrite_storage() -> AppwriteStorageService:
    """Get or create the Appwrite storage service instance"""
    global appwrite_storage
    if appwrite_storage is None:
        appwrite_storage = AppwriteStorageService()
    return appwrite_storage
