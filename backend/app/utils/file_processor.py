import os
from werkzeug.utils import secure_filename
from typing import Optional, Tuple
import logging
from docx import Document
from PyPDF2 import PdfReader
import io
import platform

class FileProcessor:
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    def __init__(self, upload_folder: str):
        self.upload_folder = upload_folder
        self.logger = logging.getLogger(__name__)
        
        # Create upload folder if it doesn't exist
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
    
    def allowed_file(self, filename: str) -> bool:
        """Check if the file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def validate_file(self, file) -> Tuple[bool, Optional[str]]:
        """Validate file type and size"""
        try:
            # Check file size
            file.seek(0, os.SEEK_END)
            size = file.tell()
            file.seek(0)
            
            if size > self.MAX_FILE_SIZE:
                return False, "File size exceeds maximum limit of 5MB"
            
            # On Windows, we'll validate based on file extension
            if platform.system() == 'Windows':
                filename = file.filename.lower()
                valid_extensions = {'.pdf', '.doc', '.docx', '.txt'}
                file_ext = os.path.splitext(filename)[1]
                
                if file_ext not in valid_extensions:
                    return False, f"Invalid file type: {file_ext}"
            else:
                # On Unix-like systems, use python-magic
                try:
                    import magic
                    mime = magic.Magic(mime=True)
                    file_type = mime.from_buffer(file.read(2048))
                    file.seek(0)
                    
                    valid_mimes = {
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain'
                    }
                    
                    if file_type not in valid_mimes:
                        return False, f"Invalid file type: {file_type}"
                except ImportError:
                    # Fallback to extension-based validation if python-magic is not available
                    filename = file.filename.lower()
                    valid_extensions = {'.pdf', '.doc', '.docx', '.txt'}
                    file_ext = os.path.splitext(filename)[1]
                    
                    if file_ext not in valid_extensions:
                        return False, f"Invalid file type: {file_ext}"
            
            return True, None
            
        except Exception as e:
            self.logger.error(f"Error validating file: {str(e)}")
            return False, "Error validating file"
    
    def save_file(self, file) -> Tuple[bool, Optional[str], Optional[str]]:
        """Save uploaded file and return success status and file path"""
        try:
            if not file or not file.filename:
                return False, None, "No file provided"
            
            if not self.allowed_file(file.filename):
                return False, None, "File type not allowed"
            
            # Validate file
            is_valid, error_message = self.validate_file(file)
            if not is_valid:
                return False, None, error_message
            
            # Secure the filename
            filename = secure_filename(file.filename)
            file_path = os.path.join(self.upload_folder, filename)
            
            # Save file
            file.save(file_path)
            self.logger.info(f"File saved successfully: {file_path}")
            
            return True, file_path, None
            
        except Exception as e:
            self.logger.error(f"Error saving file: {str(e)}")
            return False, None, "Error saving file"
    
    def read_file_content(self, file_path: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """Read content from saved file"""
        try:
            if not os.path.exists(file_path):
                return False, None, "File not found"
            
            file_extension = file_path.rsplit('.', 1)[1].lower()
            
            if file_extension == 'pdf':
                return self._read_pdf(file_path)
            elif file_extension in ['doc', 'docx']:
                return self._read_docx(file_path)
            else:  # txt
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return True, content, None
            
        except Exception as e:
            self.logger.error(f"Error reading file: {str(e)}")
            return False, None, "Error reading file"
    
    def _read_pdf(self, file_path: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """Read content from PDF file"""
        try:
            reader = PdfReader(file_path)
            content = []
            
            for page in reader.pages:
                content.append(page.extract_text())
            
            return True, '\n'.join(content), None
            
        except Exception as e:
            self.logger.error(f"Error reading PDF: {str(e)}")
            return False, None, "Error reading PDF file"
    
    def _read_docx(self, file_path: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """Read content from DOCX file"""
        try:
            doc = Document(file_path)
            content = []
            
            for paragraph in doc.paragraphs:
                content.append(paragraph.text)
            
            return True, '\n'.join(content), None
            
        except Exception as e:
            self.logger.error(f"Error reading DOCX: {str(e)}")
            return False, None, "Error reading DOCX file"
    
    def cleanup_file(self, file_path: str) -> bool:
        """Remove processed file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                self.logger.info(f"File removed: {file_path}")
                return True
            return False
        except Exception as e:
            self.logger.error(f"Error removing file: {str(e)}")
            return False 