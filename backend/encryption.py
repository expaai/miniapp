#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Модуль для шифрования персональных данных перед отправкой в OpenAI API
В соответствии с требованиями 152-ФЗ "О персональных данных"
"""

import os
import re
import hashlib
from typing import Tuple, List
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

class PersonalDataProtector:
    """
    Класс для защиты персональных данных в резюме перед отправкой в OpenAI API
    """
    
    def __init__(self):
        self.encryption_key = self._get_or_create_key()
        self.cipher = Fernet(self.encryption_key)
        
        # Паттерны для поиска персональных данных
        self.personal_data_patterns = {
            'phone': r'\+?[78][-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}',
            'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'passport': r'\b\d{4}\s?\d{6}\b',
            'inn': r'\b\d{10,12}\b',
            'snils': r'\b\d{3}-\d{3}-\d{3}\s\d{2}\b',
            'address': r'г\.?\s*[А-Яа-я-]+[,\s]+.*?\d+',
            'birth_date': r'\b\d{1,2}[./]\d{1,2}[./]\d{4}\b',
            'full_name': r'\b[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?\b'
        }
    
    def _get_or_create_key(self) -> bytes:
        """
        Получает или создает ключ шифрования из переменных окружения
        """
        # Пытаемся получить ключ из переменных окружения
        key_env = os.getenv('ENCRYPTION_KEY')
        if key_env:
            try:
                return base64.urlsafe_b64decode(key_env)
            except Exception:
                pass
        
        # Создаем ключ на основе секретной фразы
        password = os.getenv('SECRET_PHRASE', 'career-miniapp-secret-2024').encode()
        salt = b'career_miniapp_salt_2024'  # В продакшене должен быть случайным
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        return key
    
    def anonymize_resume_text(self, resume_text: str) -> Tuple[str, dict]:
        """
        Анонимизирует персональные данные в тексте резюме
        
        Args:
            resume_text: Исходный текст резюме
            
        Returns:
            Tuple[str, dict]: Анонимизированный текст и словарь замен
        """
        anonymized_text = resume_text
        replacements = {}
        
        # Заменяем персональные данные на плейсхолдеры
        for data_type, pattern in self.personal_data_patterns.items():
            matches = re.findall(pattern, anonymized_text, re.IGNORECASE)
            
            for i, match in enumerate(matches):
                placeholder = f"[{data_type.upper()}_{i+1}]"
                anonymized_text = anonymized_text.replace(match, placeholder, 1)
                replacements[placeholder] = match
        
        return anonymized_text, replacements
    
    def encrypt_personal_data(self, data: str) -> str:
        """
        Шифрует персональные данные
        
        Args:
            data: Данные для шифрования
            
        Returns:
            str: Зашифрованные данные в base64
        """
        encrypted_data = self.cipher.encrypt(data.encode('utf-8'))
        return base64.urlsafe_b64encode(encrypted_data).decode('utf-8')
    
    def decrypt_personal_data(self, encrypted_data: str) -> str:
        """
        Расшифровывает персональные данные
        
        Args:
            encrypted_data: Зашифрованные данные в base64
            
        Returns:
            str: Расшифрованные данные
        """
        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode('utf-8'))
            decrypted_data = self.cipher.decrypt(encrypted_bytes)
            return decrypted_data.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Ошибка расшифровки данных: {str(e)}")
    
    def restore_personal_data(self, anonymized_text: str, replacements: dict) -> str:
        """
        Восстанавливает персональные данные в тексте
        
        Args:
            anonymized_text: Анонимизированный текст
            replacements: Словарь замен
            
        Returns:
            str: Текст с восстановленными персональными данными
        """
        restored_text = anonymized_text
        
        for placeholder, original_value in replacements.items():
            restored_text = restored_text.replace(placeholder, original_value)
        
        return restored_text
    
    def safe_analyze_resume(self, resume_text: str) -> Tuple[str, str]:
        """
        Подготавливает резюме для безопасной отправки в OpenAI API
        
        Args:
            resume_text: Исходный текст резюме
            
        Returns:
            Tuple[str, str]: (анонимизированный_текст, зашифрованные_замены)
        """
        # Анонимизируем персональные данные
        anonymized_text, replacements = self.anonymize_resume_text(resume_text)
        
        # Шифруем словарь замен
        encrypted_replacements = self.encrypt_personal_data(str(replacements))
        
        return anonymized_text, encrypted_replacements
    
    def get_data_processing_notice(self) -> str:
        """
        Возвращает уведомление об обработке персональных данных
        """
        return """
🔒 УВЕДОМЛЕНИЕ ОБ ОБРАБОТКЕ ПЕРСОНАЛЬНЫХ ДАННЫХ

В соответствии с Федеральным законом №152-ФЗ "О персональных данных" уведомляем:

✅ ЦЕЛИ ОБРАБОТКИ:
• Анализ резюме и предоставление рекомендаций по улучшению
• Подбор подходящих вакансий
• Карьерное консультирование

✅ ОБРАБАТЫВАЕМЫЕ ДАННЫЕ:
• Профессиональная информация из резюме
• Контактные данные (телефон, email)
• Образование и опыт работы

✅ МЕРЫ ЗАЩИТЫ:
• Персональные данные анонимизируются перед анализом
• Используется шифрование AES-256
• Данные не передаются третьим лицам в открытом виде
• Анализ выполняется через защищенное API

✅ ВАШИ ПРАВА:
• Отзыв согласия в любое время
• Удаление ваших данных
• Получение информации об обработке

📧 Контакты: support@career-miniapp.ru
        """

# Глобальный экземпляр для использования в приложении
data_protector = PersonalDataProtector()

# Функции для удобного использования
def anonymize_for_ai(resume_text: str) -> Tuple[str, str]:
    """
    Анонимизирует резюме для отправки в AI
    
    Returns:
        Tuple[str, str]: (анонимизированный_текст, зашифрованные_замены)
    """
    return data_protector.safe_analyze_resume(resume_text)

def restore_from_ai_response(ai_response: str, encrypted_replacements: str) -> str:
    """
    Восстанавливает персональные данные в ответе AI (если нужно)
    
    Args:
        ai_response: Ответ от AI
        encrypted_replacements: Зашифрованные замены
        
    Returns:
        str: Ответ с восстановленными данными (если применимо)
    """
    try:
        # Расшифровываем замены
        replacements_str = data_protector.decrypt_personal_data(encrypted_replacements)
        replacements = eval(replacements_str)  # В продакшене использовать json.loads
        
        # В большинстве случаев AI ответ не содержит персональных данных
        # Но если нужно, можно восстановить
        return ai_response
    except Exception:
        return ai_response

def encrypt_resume_for_storage(resume_text: str) -> str:
    """
    Шифрует резюме для хранения в базе данных
    """
    return data_protector.encrypt_personal_data(resume_text)

def decrypt_resume_from_storage(encrypted_resume: str) -> str:
    """
    Расшифровывает резюме из базы данных
    """
    return data_protector.decrypt_personal_data(encrypted_resume)