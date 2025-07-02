from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Согласие на обработку персональных данных
    data_processing_consent = Column(Boolean, default=False)
    consent_date = Column(DateTime(timezone=True), nullable=True)
    
    # Связи
    sessions = relationship("Session", back_populates="user")
    resumes = relationship("Resume", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Данные сессии
    selected_profession = Column(String, nullable=True)
    career_stage = Column(String, nullable=True)  # student/professional
    career_goal = Column(String, nullable=True)  # цель пользователя
    
    # Связи
    user = relationship("User", back_populates="sessions")
    resumes = relationship("Resume", back_populates="session")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Данные файла
    filename = Column(String)
    file_size = Column(Integer)
    file_type = Column(String)  # pdf, docx, txt
    
    # Содержимое резюме
    extracted_text = Column(Text)
    
    # Зашифрованный файл (опционально)
    encrypted_file = Column(LargeBinary, nullable=True)
    
    # Связи
    user = relationship("User", back_populates="resumes")
    session = relationship("Session", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume")

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Результаты анализа
    ai_analysis = Column(Text)  # JSON строка с результатами анализа
    analysis_type = Column(String)  # resume_analysis, career_advice, etc.
    
    # Метаданные
    model_used = Column(String, default="gpt-4o-mini")
    tokens_used = Column(Integer, nullable=True)
    processing_time = Column(Integer, nullable=True)  # в миллисекундах
    
    # Связи
    resume = relationship("Resume", back_populates="analyses")