#!/usr/bin/env python3
# Скрипт для создания тестового PDF файла

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch

def create_test_pdf():
    filename = "test_resume.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Заголовок
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, height - 100, "РЕЗЮМЕ")
    
    # Основная информация
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, height - 140, "Иванов Иван Иванович")
    c.setFont("Helvetica", 12)
    c.drawString(100, height - 160, "Веб-разработчик")
    
    # Контакты
    y_pos = height - 200
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, y_pos, "КОНТАКТНАЯ ИНФОРМАЦИЯ:")
    
    c.setFont("Helvetica", 10)
    y_pos -= 20
    c.drawString(100, y_pos, "Телефон: +7 (999) 123-45-67")
    y_pos -= 15
    c.drawString(100, y_pos, "Email: ivanov@example.com")
    y_pos -= 15
    c.drawString(100, y_pos, "Город: Москва")
    
    # Опыт работы
    y_pos -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, y_pos, "ОПЫТ РАБОТЫ:")
    
    c.setFont("Helvetica", 10)
    y_pos -= 25
    c.drawString(100, y_pos, "2020-2023 - Senior Frontend Developer, ООО 'ТехКомпания'")
    y_pos -= 15
    c.drawString(120, y_pos, "• Разработка веб-приложений на React.js и Vue.js")
    y_pos -= 15
    c.drawString(120, y_pos, "• Оптимизация производительности приложений")
    y_pos -= 15
    c.drawString(120, y_pos, "• Ментoring junior разработчиков")
    
    y_pos -= 25
    c.drawString(100, y_pos, "2018-2020 - Frontend Developer, ИП 'ВебСтудия'")
    y_pos -= 15
    c.drawString(120, y_pos, "• Создание адаптивных веб-сайтов")
    y_pos -= 15
    c.drawString(120, y_pos, "• Интеграция с REST API")
    
    # Образование
    y_pos -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, y_pos, "ОБРАЗОВАНИЕ:")
    
    c.setFont("Helvetica", 10)
    y_pos -= 20
    c.drawString(100, y_pos, "2014-2018 - Бакалавр, Информационные технологии")
    y_pos -= 15
    c.drawString(100, y_pos, "Московский технический университет")
    
    # Навыки
    y_pos -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, y_pos, "НАВЫКИ:")
    
    c.setFont("Helvetica", 10)
    y_pos -= 20
    c.drawString(100, y_pos, "• JavaScript (ES6+), TypeScript")
    y_pos -= 15
    c.drawString(100, y_pos, "• React.js, Vue.js, Angular")
    y_pos -= 15
    c.drawString(100, y_pos, "• HTML5, CSS3, SASS/SCSS")
    y_pos -= 15
    c.drawString(100, y_pos, "• Node.js, Express.js")
    y_pos -= 15
    c.drawString(100, y_pos, "• Git, Docker, CI/CD")
    
    c.save()
    print(f"PDF файл '{filename}' создан успешно!")

if __name__ == "__main__":
    create_test_pdf()