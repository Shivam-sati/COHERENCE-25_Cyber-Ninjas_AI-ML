import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import current_app, render_template
import logging

class EmailService:
    def __init__(self, app=None):
        self.app = app
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.example.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.smtp_username = os.environ.get('SMTP_USERNAME', 'username')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', 'password')
        self.sender_email = os.environ.get('SENDER_EMAIL', 'hr@example.com')
        
        # Create templates directory if it doesn't exist
        if app:
            self.templates_dir = os.path.join(app.root_path, 'templates', 'emails')
            os.makedirs(self.templates_dir, exist_ok=True)
            
            # Create a default template if it doesn't exist
            default_template_path = os.path.join(self.templates_dir, 'default.html')
            if not os.path.exists(default_template_path):
                with open(default_template_path, 'w') as f:
                    f.write("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #4F46E5; color: white; padding: 10px 20px; }
                            .content { padding: 20px; background-color: #f9f9f9; }
                            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>{{ company_name }}</h1>
                            </div>
                            <div class="content">
                                <p>Dear {{ recipient_name }},</p>
                                <p>{{ message }}</p>
                                <p>Best regards,<br>{{ sender_name }}<br>{{ company_name }}</p>
                            </div>
                            <div class="footer">
                                <p>This is an automated email. Please do not reply to this message.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """)
    
    def send_email(self, recipient_email, subject, message, template_name='default.html', **kwargs):
        """
        Send an email to a recipient using a template
        
        Args:
            recipient_email (str): The recipient's email address
            subject (str): The email subject
            message (str): The main message content
            template_name (str): The name of the template file to use
            **kwargs: Additional template variables
            
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            # Create message container
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.sender_email
            msg['To'] = recipient_email
            
            # Add default template variables
            template_vars = {
                'recipient_email': recipient_email,
                'subject': subject,
                'message': message,
                'company_name': 'Cyber Ninjas AI-ML',
                'sender_name': 'HR Team',
                **kwargs
            }
            
            # Render HTML content from template
            template_path = os.path.join(self.templates_dir, template_name)
            if os.path.exists(template_path):
                with open(template_path, 'r') as f:
                    template_content = f.read()
                    
                # Simple template rendering (in a real app, use a proper template engine)
                html_content = template_content
                for key, value in template_vars.items():
                    html_content = html_content.replace('{{ ' + key + ' }}', str(value))
            else:
                # Fallback to simple HTML if template doesn't exist
                html_content = f"""
                <html>
                <body>
                    <p>Dear {template_vars.get('recipient_name', 'Candidate')},</p>
                    <p>{message}</p>
                    <p>Best regards,<br>{template_vars.get('sender_name', 'HR Team')}<br>{template_vars.get('company_name', 'Cyber Ninjas AI-ML')}</p>
                </body>
                </html>
                """
            
            # Create plain text version as fallback
            text_content = f"""
            Dear {template_vars.get('recipient_name', 'Candidate')},
            
            {message}
            
            Best regards,
            {template_vars.get('sender_name', 'HR Team')}
            {template_vars.get('company_name', 'Cyber Ninjas AI-ML')}
            """
            
            # Attach parts
            part1 = MIMEText(text_content, 'plain')
            part2 = MIMEText(html_content, 'html')
            msg.attach(part1)
            msg.attach(part2)
            
            # For development/testing, log the email instead of sending
            if current_app.config.get('TESTING', False) or current_app.config.get('DEBUG', False):
                current_app.logger.info(f"Would send email to {recipient_email}: {subject}")
                return True
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
            return True
            
        except Exception as e:
            current_app.logger.error(f"Error sending email: {str(e)}")
            return False
    
    def send_bulk_emails(self, recipients, subject, message, template_name='default.html', **kwargs):
        """
        Send the same email to multiple recipients
        
        Args:
            recipients (list): List of recipient email addresses or dicts with 'email' and 'name' keys
            subject (str): The email subject
            message (str): The main message content
            template_name (str): The name of the template file to use
            **kwargs: Additional template variables
            
        Returns:
            dict: Results of the email sending operation
        """
        results = {
            'success': [],
            'failed': []
        }
        
        for recipient in recipients:
            if isinstance(recipient, dict):
                email = recipient.get('email')
                name = recipient.get('name', '')
                recipient_vars = {**kwargs, 'recipient_name': name}
            else:
                email = recipient
                recipient_vars = kwargs
            
            if not email:
                continue
                
            success = self.send_email(email, subject, message, template_name, **recipient_vars)
            
            if success:
                results['success'].append(email)
            else:
                results['failed'].append(email)
                
        return results
